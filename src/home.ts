import express from 'express';
import sharp from 'sharp';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || 'http://localhost:3000';
const IMAGE_DIR = path.join('/tmp', 'images'); // Directorio temporal en Vercel
const IMAGE_PATH = path.join(IMAGE_DIR, 'app-image.jpg');

// Crea el directorio temporal para imágenes si no existe
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// Ruta para la página principal
app.get('/', async (req, res) => {
    const appName = 'Mi App';

    try {
        // Verifica si la imagen ya existe
        if (!fs.existsSync(IMAGE_PATH)) {
            // Genera una imagen JPG directamente con `sharp`
            const imageBuffer = await sharp({
                create: {
                    width: 576,
                    height: 576,
                    channels: 3, // JPG no soporta canal alfa (transparencia)
                    background: { r: 138, g: 43, b: 226 }, // Fondo violeta
                },
            })
                .composite([
                    {
                        input: Buffer.from(`
                            <svg width="576" height="576" xmlns="http://www.w3.org/2000/svg">
                                <text x="50%" y="50%" font-size="50" fill="white" text-anchor="middle" dominant-baseline="middle">
                                    ${appName}
                                </text>
                            </svg>
                        `),
                        top: 0,
                        left: 0,
                    },
                ])
                .jpeg({ quality: 80 }) // Generar en JPG con calidad del 80%
                .toBuffer();

            fs.writeFileSync(IMAGE_PATH, imageBuffer);
            console.log('Imagen JPG generada para la página principal.');
        } else {
            console.log('Imagen JPG reutilizada para la página principal.');
        }

        // Genera la URL de la imagen
        const imageUrl = `${DOMAIN}/images/app-image.jpg`;

        // Responde con la página HTML y metaetiquetas dinámicas
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta property="og:title" content="${appName}" />
            <meta property="og:description" content="Descripción de ${appName}" />
            <meta property="og:image" content="${imageUrl}" />
            <meta property="og:url" content="${DOMAIN}/" />
            <title>${appName}</title>
        </head>
        <body>
            <h1>${appName}</h1>
            <img src="${imageUrl}" alt="Imagen de ${appName}" />
        </body>
        </html>
        `;

        res.send(html);
    } catch (error) {
        console.error('Error generating the JPG image:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Ruta para servir la imagen generada desde /tmp
app.use('/images', express.static(IMAGE_DIR));

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Home ejecutándose en http://localhost:${PORT}`);
});
