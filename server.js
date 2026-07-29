const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint directo que nunca expira para el Roku
app.get('/live/colorvision.m3u8', async (req, res) => {
    try {
        const respuestaCV = await axios.get('https://colorvision.com.do/en-vivo/', {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 4000
        });

        const html = respuestaCV.data;
        const matchDM = html.match(/dailymotion\.com\/embed\/video\/([a-zA-Z0-9]+)/i) || 
                        html.match(/geo\.dailymotion\.com\/player\/[^.]+\.html\?video=([a-zA-Z0-9]+)/i);

        if (matchDM && matchDM[1]) {
            const videoId = matchDM[1];
            const resDM = await axios.get(`https://api.dailymotion.com/video/${videoId}?fields=stream_hls_url`);
            if (resDM.data && resDM.data.stream_hls_url) {
                // Redirigir al Roku inmediatamente al stream fresco
                return res.redirect(302, resDM.data.stream_hls_url);
            }
        }
        res.status(500).send("No se pudo obtener el stream");
    } catch (e) {
        res.status(500).send("Error interno");
    }
});

app.get('/api/canales', (req, res) => {
    res.json([
        {
            title: "Color Visión (Canal 9)",
            streamUrl: "https://roku-backend-rd.onrender.com/live/colorvision.m3u8"
        },
        {
            title: "RTVD (Canal 4)",
            streamUrl: "https://cdn.protvradiostream.com/canal4rd-1/ngrp:canal4rd-1_all/playlist.m3u8"
        }
    ]);
});

app.listen(PORT, () => console.log("Servidor listo"));
