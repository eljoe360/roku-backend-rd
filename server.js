const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Ruta principal para comprobar que el servicio está activo
app.get('/', (req, res) => {
    res.send('Servidor de Canales Dominicanos activo.');
});

// Ruta que consultará tu aplicación Roku
app.get('/api/canales', async (req, res) => {
    let urlColorVision = "https://stream.colorvision.com.do/live/colorvision/playlist.m3u8";

    // Intentar extraer el .m3u8 actualizado de Color Visión
    try {
        const respuestaCV = await axios.get('https://colorvision.com.do/en-vivo/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 4000
        });

        const html = respuestaCV.data;
        const match = html.match(/(https?:\/\/[^"']+\.m3u8[^"']*)/i);

        if (match && match[1]) {
            urlColorVision = match[1];
        }
    } catch (error) {
        console.log("No se pudo extraer dinámicamente Color Visión, usando URL estática por defecto.");
    }

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
            streamUrl: urlColorVision,
            poster: "https://i.imgur.com/xQJ8kLO.png"
        }
    ];

    res.json(canalesDominicanos);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
