export const airports = [
  { code:'BOG', name:'El Dorado', city:'Bogotá', country:'Colombia', lat:4.7016, lon:-74.1469 },
  { code:'MDE', name:'José María Córdova', city:'Medellín', country:'Colombia', lat:6.1645, lon:-75.4231 },
  { code:'CTG', name:'Rafael Núñez', city:'Cartagena', country:'Colombia', lat:10.4424, lon:-75.5130 },
  { code:'CLO', name:'Alfonso Bonilla Aragón', city:'Cali', country:'Colombia', lat:3.5432, lon:-76.3816 },
  { code:'BAQ', name:'Ernesto Cortissoz', city:'Barranquilla', country:'Colombia', lat:10.8896, lon:-74.7808 },
  { code:'SMR', name:'Simón Bolívar', city:'Santa Marta', country:'Colombia', lat:11.1196, lon:-74.2306 },
  { code:'PEI', name:'Matecaña', city:'Pereira', country:'Colombia', lat:4.8127, lon:-75.7395 },
  { code:'ADZ', name:'Gustavo Rojas Pinilla', city:'San Andrés', country:'Colombia', lat:12.5836, lon:-81.7112 },
  { code:'MIA', name:'Miami International', city:'Miami', country:'Estados Unidos', lat:25.7959, lon:-80.2870 },
  { code:'MAD', name:'Adolfo Suárez Madrid-Barajas', city:'Madrid', country:'España', lat:40.4983, lon:-3.5676 },
  { code:'MEX', name:'Benito Juárez', city:'Ciudad de México', country:'México', lat:19.4361, lon:-99.0719 },
  { code:'PTY', name:'Tocumen', city:'Ciudad de Panamá', country:'Panamá', lat:9.0714, lon:-79.3835 },
  { code:'JFK', name:'John F. Kennedy', city:'Nueva York', country:'Estados Unidos', lat:40.6413, lon:-73.7781 },
  { code:'CDG', name:'Charles de Gaulle', city:'París', country:'Francia', lat:49.0097, lon:2.5479 },
  { code:'NRT', name:'Narita', city:'Tokio', country:'Japón', lat:35.7720, lon:140.3929 },
  { code:'SCL', name:'Arturo Merino Benítez', city:'Santiago', country:'Chile', lat:-33.3930, lon:-70.7858 },
  { code:'LIM', name:'Jorge Chávez', city:'Lima', country:'Perú', lat:-12.0219, lon:-77.1143 },
  { code:'GRU', name:'Guarulhos', city:'São Paulo', country:'Brasil', lat:-23.4356, lon:-46.4731 }
];

export const destinations = [
  { city:'Cartagena', country:'Colombia', code:'CTG', price:260000, stay:190000, season:'Dic – Abr', months:[12,1,2,3,4], score:96, tag:'Caribe soleado', description:'Murallas, playas y gastronomía caribeña. El clima suele ser más seco entre diciembre y abril.', emoji:'☀️', lat:10.39, lon:-75.50 },
  { city:'Santa Marta', country:'Colombia', code:'SMR', price:290000, stay:170000, season:'Dic – Abr', months:[12,1,2,3,4], score:94, tag:'Mar y montaña', description:'Puerta de entrada al Tayrona y a la Sierra Nevada. Ideal para combinar playa y naturaleza.', emoji:'🌴', lat:11.24, lon:-74.20 },
  { city:'San Andrés', country:'Colombia', code:'ADZ', price:420000, stay:230000, season:'Feb – May', months:[2,3,4,5], score:91, tag:'Mar de siete colores', description:'Aguas turquesas y actividades acuáticas. Revisa el pronóstico por temporada.', emoji:'🏝️', lat:12.58, lon:-81.70 },
  { city:'Medellín', country:'Colombia', code:'MDE', price:180000, stay:150000, season:'Dic – Feb / Jul – Ago', months:[12,1,2,7,8], score:89, tag:'Ciudad primaveral', description:'Cultura, gastronomía y pueblos cercanos. La Feria de las Flores suele animar agosto.', emoji:'🌺', lat:6.24, lon:-75.58 },
  { city:'Eje Cafetero', country:'Colombia', code:'PEI', price:210000, stay:145000, season:'Dic – Feb / Jul – Ago', months:[12,1,2,7,8], score:90, tag:'Montañas verdes', description:'Fincas cafeteras, termales y paisajes. Lleva ropa para lluvia: el clima cambia rápido.', emoji:'☕', lat:4.75, lon:-75.75 },
  { city:'Ciudad de Panamá', country:'Panamá', code:'PTY', price:650000, stay:260000, season:'Ene – Abr', months:[1,2,3,4], score:88, tag:'Escapada internacional', description:'Casco antiguo, Canal de Panamá y conexiones regionales.', emoji:'🌆', lat:8.98, lon:-79.52 },
  { city:'Lima', country:'Perú', code:'LIM', price:1050000, stay:220000, season:'May – Sep', months:[5,6,7,8,9], score:86, tag:'Capital gastronómica', description:'Museos, costa del Pacífico y una escena gastronómica reconocida.', emoji:'🍽️', lat:-12.05, lon:-77.04 },
  { city:'Santiago', country:'Chile', code:'SCL', price:1650000, stay:290000, months:[10,11,12,1,2,3,4], season:'Oct – Abr', score:84, tag:'Andes y ciudad', description:'Vistas a los Andes, viñedos y escapadas a la montaña.', emoji:'🏔️', lat:-33.45, lon:-70.66 },
  { city:'Madrid', country:'España', code:'MAD', price:3600000, stay:420000, months:[4,5,6,9,10], season:'Abr – Jun / Sep – Oct', score:90, tag:'Europa cultural', description:'Temperaturas más amables y menos presión turística que en pleno verano.', emoji:'🏛️', lat:40.42, lon:-3.70 },
  { city:'Tokio', country:'Japón', code:'NRT', price:5100000, stay:470000, months:[3,4,5,10,11], season:'Mar – May / Oct – Nov', score:95, tag:'Tradición y tecnología', description:'Primavera de cerezos y otoño de arces. Reserva con anticipación en semanas populares.', emoji:'🌸', lat:35.68, lon:139.69 }
];

export const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];