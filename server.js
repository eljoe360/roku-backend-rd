const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Ruta principal para comprobar que el servicio está activo
app.get('/', (req, res) => {
  res.send('Servidor de Canales Dominicanos activo.');
});

// Ruta que consultará tu aplicación Roku
app.get('/api/canales', (req, res) => {
  const canalesDominicanos = [
    {
      title: "Telemicro (Canal 5)",
      description: "Entretenimiento y programas dominicanos en vivo.",
      streamUrl: "https://stmv1.srvif.com/telemicro/telemicro/playlist.m3u8",
      poster: "https://i.imgur.com/vH9Z6X2.png"
    },
    {
      title: "Color Visión (Canal 9)",
      description: "Noticias, opinión y programas de televisión dominicana.",
      streamUrl: "https://stream.colorvision.com.do/live/colorvision/playlist.m3u8",
      poster: "https://i.imgur.com/xQJ8kLO.png"
    },
    {
      title: "CDN 37",
      description: "Cadena Dominicana de Noticias.",
      streamUrl: "https://stmv1.srvif.com/cdn37/cdn37/playlist.m3u8",
      poster: "https://i.imgur.com/R8Mzp4w.png"
    },
    {
      title: "RTVD 4 (CERTV)",
      description: "Televisión pública de la República Dominicana.",
      streamUrl: "https://stmv1.srvif.com/certv/certv/playlist.m3u8",
      poster: "https://i.imgur.com/Y3K0mL3.png"
    },
    {
      title: "Teleantillas (Canal 2)",
      description: "Programación abierta de variedad y entretenimiento.",
      streamUrl: "https://stmv1.srvif.com/teleantillas/teleantillas/playlist.m3u8",
      poster: "https://i.imgur.com/L8aE9xM.png"
    }
  ];

  res.json(canalesDominicanos);
});

app.listen(PORT, () => {
  console.log(`Servidor de canales listo en el puerto ${PORT}`);
});