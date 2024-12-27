// src/api.ts
import express from 'express';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || 'https://yourdomain.com';

// Ruta para generar una imagen dinámica con ID
app.get('/api/:id', async (req, res) => {
    const userId = req.params.id;
    const imageUrl = `${DOMAIN}/images/${userId}.png`;
    const pageUrl = `${DOMAIN}/api/${userId}`;

    // Generar una imagen dinámica
    const imageBuffer = await sharp({
        create: {
            width: 576,
            height: 576,
            channels: 4,
            background: { r: 138, g: 43, b: 226, alpha: 1 }, // Fondo violeta
        },
    })
        .composite([
            {
                input: Buffer.from(`
                    <svg width="576" height="576">
                        <text x="50%" y="50%" font-size="50" fill="white" text-anchor="middle" alignment-baseline="central">
                            ${userId}
                        </text>
                    </svg>
                `),
                top: 0,
                left: 0,
            },
        ])
        .png()
        .toBuffer();

    // Responder con una página HTML con metaetiquetas dinámicas
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta property="og:title" content="ID de Usuario: ${userId}" />
        <meta property="og:description" content="Mi App" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${pageUrl}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <title>ID de Usuario: ${userId}</title>
    </head>
    <body>
        <h1>ID de Usuario: ${userId}</h1>
        <img src="data:image/png;base64,${imageBuffer.toString('base64')}" alt="Imagen del usuario ${userId}" />
    </body>
    </html>
    `;

    res.send(html);
});

app.listen(PORT, () => {
    console.log(`API ejecutándose en http://localhost:${PORT}/api/:id`);
});