import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

const aircraftCache = new Map();

function isHelicopterRecord(a) {
  const type = String(a.model || a.aircraftType || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const category = String(a.category || '').toUpperCase();
  return /^(R22|R44|R66|A109|A119|A139|A169|A189|AS32|AS35|AS50|AS55|AS65|BK17|B06|B206|B212|B407|B412|B429|B505|B47G|EC20|EC25|EC30|EC35|EC45|EC55|EC75|H120|H125|H130|H135|H145|H155|H160|H175|H215|H225|H500|H60|H64|H47|S61|S70|S76|S92|AW09|AW10|AW11|AW12|AW13|AW16|AW18|AW19|MD52|MD60|OH58|UH60|CH47|AH64|UH1)/.test(type) || /ROTORCRAFT|HELICOPTER/.test(category) || ['A7', 'B7'].includes(category);
}

function normalizeAircraft(a) {
  return {
    hex: a.hex || '',
    callsign: (a.flight || '').trim() || 'SIN IDENTIFICAR',
    registration: a.r || null,
    model: a.t || a.desc || null,
    aircraftType: a.t || null,
    operator: a.ownOp || a.op || a.owner || null,
    owner: a.ownOp || a.op || a.owner || null,
    latitude: a.lat ?? null,
    longitude: a.lon ?? null,
    altitude: a.alt_baro === 'ground' ? 0 : (Number(a.alt_baro) || Number(a.alt_geom) || null),
    speed: Number(a.gs) || null,
    heading: Number(a.track) || 0,
    verticalRate: Number(a.baro_rate) || 0,
    onGround: a.alt_baro === 'ground',
    category: a.category || null,
    military: Boolean((Number(a.dbFlags) & 1) || a.mil),
    squawk: a.squawk || null,
    seen: a.seen ?? null,
    source: 'adsb.lol'
  };
}

app.get('/api/health', (_req, res) => res.json({
  status: 'ok',
  service: 'AeroScope API',
  flightProvider: 'adsb.lol',
  faresConfigured: Boolean(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET),
  timestamp: new Date().toISOString()
}));

app.get('/api/aircraft', async (req, res) => {
  const lat = Number(req.query.lat ?? 4.711);
  const lon = Number(req.query.lon ?? -74.0721);
  const radius = Math.min(250, Math.max(10, Number(req.query.radius ?? 250)));
  const kind = req.query.kind || 'all';
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return res.status(400).json({ error: 'Coordenadas inválidas.' });

  const key = [lat.toFixed(2), lon.toFixed(2), radius, kind].join(':');
  const cached = aircraftCache.get(key);
  if (cached && Date.now() - cached.time < 180000) return res.json({ ...cached.data, cached: true });

  try {
    const endpoint = kind === 'military'
      ? 'https://api.adsb.lol/v2/mil'
      : `https://api.adsb.lol/v2/point/${lat}/${lon}/${radius}`;
    const response = await fetch(endpoint, { headers: { Accept: 'application/json', 'User-Agent': 'AeroScope/1.0' }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`adsb.lol respondió ${response.status}`);
    const payload = await response.json();
    let aircraft = (payload.ac || []).map(normalizeAircraft).filter(a => Number.isFinite(a.latitude) && Number.isFinite(a.longitude));
    if (kind === 'helicopter') aircraft = aircraft.filter(isHelicopterRecord);
    if (kind === 'military') aircraft.forEach(a => { a.military = true; });
    const data = {
      aircraft,
      count: aircraft.length,
      source: 'adsb.lol',
      updatedAt: new Date().toISOString(),
      coverage: kind === 'military' ? 'Aeronaves etiquetadas como militares visibles públicamente' : `Radio aproximado de ${radius} NM`,
      notice: 'Cobertura comunitaria ADS-B/MLAT. No todas las aeronaves transmiten o son visibles.'
    };
    aircraftCache.set(key, { data, time: Date.now() });
    return res.json(data);
  } catch (primaryError) {
    if (kind === 'military') {
      return res.status(502).json({ error: 'No fue posible consultar el tráfico militar público.', detail: primaryError.message, aircraft: [], count: 0 });
    }
    try {
      const latDelta = radius / 60;
      const lonDelta = radius / (60 * Math.max(0.2, Math.cos(lat * Math.PI / 180)));
      const params = new URLSearchParams({
        lamin: String(Math.max(-90, lat - latDelta)),
        lamax: String(Math.min(90, lat + latDelta)),
        lomin: String(Math.max(-180, lon - lonDelta)),
        lomax: String(Math.min(180, lon + lonDelta))
      });
      const fallbackResponse = await fetch(`https://opensky-network.org/api/states/all?${params}`, { signal: AbortSignal.timeout(15000) });
      if (!fallbackResponse.ok) throw new Error(`OpenSky respondió ${fallbackResponse.status}`);
      const payload = await fallbackResponse.json();
      let aircraft = (payload.states || []).filter(s => s[5] != null && s[6] != null).map(s => ({
        hex: s[0], callsign: (s[1] || '').trim() || 'SIN IDENTIFICAR',
        registration: null, model: null, latitude: s[6], longitude: s[5],
        altitude: s[7] == null ? null : Math.round(s[7] * 3.28084),
        speed: s[9] == null ? null : Math.round(s[9] * 1.94384),
        heading: Number(s[10]) || 0,
        verticalRate: s[11] == null ? 0 : Math.round(s[11] * 196.85),
        onGround: Boolean(s[8]), category: null, military: false,
        squawk: s[14] || null, source: 'OpenSky Network',
        originCountry: s[2] || null, operator: null, owner: null, aircraftType: null
      }));
      if (kind === 'helicopter') aircraft = aircraft.filter(isHelicopterRecord);
      const data = {
        aircraft, count: aircraft.length, source: 'OpenSky Network',
        updatedAt: new Date().toISOString(), coverage: 'Área aproximada de consulta',
        notice: 'Proveedor alternativo OpenSky. Su respuesta no incluye modelo ni matrícula en todos los registros.'
      };
      aircraftCache.set(key, { data, time: Date.now() });
      return res.json(data);
    } catch (fallbackError) {
      return res.status(502).json({
        error: 'No fue posible consultar los proveedores de tráfico aéreo.',
        detail: `${primaryError.message}; ${fallbackError.message}`,
        aircraft: [], count: 0
      });
    }
  }
});

let amadeusToken = null;
let tokenExpiresAt = 0;

async function getAmadeusToken() {
  if (amadeusToken && Date.now() < tokenExpiresAt) return amadeusToken;
  const base = process.env.AMADEUS_ENV === 'production' ? 'https://api.amadeus.com' : 'https://test.api.amadeus.com';
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.AMADEUS_CLIENT_ID,
    client_secret: process.env.AMADEUS_CLIENT_SECRET
  });
  const response = await fetch(`${base}/v1/security/oauth2/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body
  });
  if (!response.ok) throw new Error('No se pudo autenticar con Amadeus.');
  const data = await response.json();
  amadeusToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return amadeusToken;
}

app.get('/api/flights/offers', async (req, res) => {
  const { origin, destination, departureDate, returnDate, adults = '1' } = req.query;
  if (!origin || !destination || !departureDate) return res.status(400).json({ error: 'Origen, destino y fecha de salida son obligatorios.' });
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    return res.status(503).json({ configured: false, error: 'Añade tus credenciales de Amadeus al archivo .env para consultar tarifas reales.' });
  }
  try {
    const base = process.env.AMADEUS_ENV === 'production' ? 'https://api.amadeus.com' : 'https://test.api.amadeus.com';
    const token = await getAmadeusToken();
    const params = new URLSearchParams({
      originLocationCode: origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate,
      adults: String(Math.max(1, Math.min(9, Number(adults) || 1))),
      currencyCode: 'COP',
      max: '12'
    });
    if (returnDate) params.set('returnDate', returnDate);
    const response = await fetch(`${base}/v2/shopping/flight-offers?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.errors?.[0]?.detail || 'No se encontraron tarifas.' });
    const offers = (data.data || []).map(o => ({
      id: o.id,
      price: Number(o.price?.grandTotal),
      currency: o.price?.currency,
      validatingAirline: o.validatingAirlineCodes?.[0],
      segments: (o.itineraries || []).flatMap(i => i.segments || []).map(s => ({
        carrier: s.carrierCode, flight: s.number, from: s.departure?.iataCode,
        to: s.arrival?.iataCode, departure: s.departure?.at, arrival: s.arrival?.at,
        aircraft: s.aircraft?.code
      }))
    })).sort((a, b) => a.price - b.price);
    res.json({ configured: true, currency: data.meta?.currency || 'COP', offers });
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`AeroScope API disponible en http://localhost:${PORT}`));
