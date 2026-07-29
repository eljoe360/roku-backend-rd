const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Servidor de Canales Dominicanos activo.');
});

app.get('/api/canales', async (req, res) => {
    let urlColorVision = "https://stream.colorvision.com.do/live/colorvision/playlist.m3u8";

    try {
        const respuestaCV = await axios.get('https://colorvision.com.do/en-vivo/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 5000
        });

        const html = respuestaCV.data;
        // Buscar el ID del video de DailyMotion en la página de Color Visión
        const matchDM = html.match(/dailymotion\.com\/embed\/video\/([a-zA-Z0-9]+)/i) || html.match(/geo\.dailymotion\.com\/player\/[^.]+\.html\?video=([a-zA-Z0-9]+)/i);

        if (matchDM && matchDM[1]) {
            const videoId = matchDM[1];
            // Consultar la API pública de DailyMotion para obtener el m3u8 directo
            const resDM = await axios.get(`https://api.dailymotion.com/video/${videoId}?fields=stream_hls_url`);
            if (resDM.data && resDM.data.stream_hls_url) {
                urlColorVision = resDM.data.stream_hls_url;
            }
        }
    } catch (error) {
        console.log("No se pudo extraer dinámicamente Color Visión, usando URL de reserva.");
    }

    const canalesDominicanos = [
        {
            title: "Color Visión (Canal 9)",
            description: "Noticias, opinión y programas de televisión dominicana.",
            streamUrl: urlColorVision,
            headers: [
                "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer: https://www.dailymotion.com/"
            ],
            poster: "https://i.imgur.com/xQJ8kLO.png"
        },
        {
            title: "Telemicro (Canal 5)",
            description: "Entretenimiento y programas dominicanos en vivo.",
            streamUrl: "https://stmv1.srvif.com/telemicro/telemicro/playlist.m3u8",
            headers: [
                "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            ],
            poster: "https://i.imgur.com/vH9Z6X2.png"
        }
    ];

    res.json(canalesDominicanos);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
