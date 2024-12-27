// src/home.ts
import express from 'express';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || 'https://yourdomain.com';

// Ruta para la página principal
app.get('/', async (req, res) => {
    const appName = 'Mi App';
    const imageUrl = `${DOMAIN}/images/app-image.png`;

    // Generar una imagen estática
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
                            ${appName}
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
        <meta property="og:title" content="Mi App" />
        <meta property="og:description" content="Descripción de Mi App" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${DOMAIN}/" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <title>Mi App</title>
    </head>
    <body>
        <h1>Mi App</h1>
        <img src="data:image/png;base64,${imageBuffer.toString('base64')}" alt="Imagen de Mi App" />
    </body>
    </html>
    `;

    res.send(html);
});

app.listen(PORT, () => {
    console.log(`Home ejecutándose en http://localhost:${PORT}`);
});