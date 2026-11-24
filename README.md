# AeroScope

Aplicación web para seguimiento de tráfico aéreo, consulta de aeronaves y planificación orientativa de viajes.

## Requisitos

- Node.js 20 o superior
- npm
- Visual Studio 2022 (se abrió la carpeta del proyecto) o Visual Studio Code

## Instalación y ejecución

Desde una terminal en esta carpeta:

```powershell
npm install
npm run dev
```

Abre http://localhost:5173. El backend Express queda disponible en http://localhost:4000.

Para compilar la versión de producción:

```powershell
npm run build
```

## Módulos

### Radar aéreo

- Mapa Leaflet centrado inicialmente en Bogotá.
- Consulta de aeronaves dentro de un radio de hasta 250 millas náuticas alrededor del centro del mapa.
- Al mover el mapa se consulta la nueva zona.
- Lista con indicativo, modelo ICAO, matrícula, altitud, velocidad, rumbo y código hexadecimal cuando esos datos están disponibles.
- Filtro de aeronaves etiquetadas como militares.
- Actualización automática cada 3 minutos y botón de actualización manual.

### Proveedores de tráfico

- **adsb.lol**: fuente principal de posiciones y datos ADS-B/MLAT, sin clave para el endpoint público. Su cobertura depende de receptores comunitarios y puede ser incompleta. Atribución requerida: adsb.lol, licencia ODbL 1.0.
- **OpenSky Network**: alternativa de posiciones si el proveedor principal no responde. La respuesta de OpenSky puede no incluir matrícula ni modelo.
- No se debe interpretar la ausencia de una aeronave como prueba de que no existe o no está volando. Algunas aeronaves no transmiten, están fuera de cobertura o restringen su información.
- El filtro militar muestra registros marcados por la fuente pública; no es una lista completa de operaciones militares.

### Planificador de viajes

- Origen y destino, fechas, pasajeros y noches.
- Distancia aproximada.
- Presupuesto orientativo separado en vuelos ida/vuelta, hospedaje, alimentación y actividades.
- Destinos ordenables por mejor temporada o menor coste estimado.
- Los valores del catálogo son referencias iniciales, no precios de mercado en tiempo real.

### Tarifas aéreas con Amadeus

Para consultar tarifas reales, crea una aplicación en Amadeus for Developers y añade las credenciales en el archivo `.env`:

```env
PORT=4000
AMADEUS_CLIENT_ID=tu_api_key
AMADEUS_CLIENT_SECRET=tu_api_secret
AMADEUS_ENV=test
```

- `test`: entorno de pruebas con datos limitados y en caché.
- `production`: consulta el entorno de producción, sujeto a las condiciones y habilitación de Amadeus.
- Reinicia `npm run dev` después de cambiar `.env`.
- La integración consulta ofertas; no compra ni emite tiquetes.

## API local

- `GET /api/health`: estado de la API y configuración de Amadeus.
- `GET /api/aircraft?lat=4.711&lon=-74.0721&radius=250&kind=all`: aeronaves alrededor de un punto.
- `GET /api/aircraft?kind=military`: aeronaves etiquetadas como militares en el feed público.
- `GET /api/flights/offers?origin=BOG&destination=CTG&departureDate=2027-01-15&returnDate=2027-01-20&adults=1`: ofertas de Amadeus.

## Estructura

- `src/App.jsx`: interfaz, mapa, radar y planificador.
- `src/data.js`: aeropuertos y catálogo de destinos.
- `src/styles.css`: diseño adaptable.
- `server/index.js`: API Express, normalización de aeronaves y conexión Amadeus.
- `.env`: credenciales locales, excluido de Git.
