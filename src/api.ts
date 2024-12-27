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
const IMAGE_LIFETIME_MS = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

// Crea el directorio temporal para imágenes si no existe
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// Verifica si una imagen es válida (dentro del tiempo de vida)
const isImageExpired = (imagePath: string): boolean => {
    const stats = fs.statSync(imagePath);
    const now = Date.now();
    return now - stats.mtimeMs > IMAGE_LIFETIME_MS;
};

// Ruta para generar una imagen dinámica con ID
app.get('/api/:id', async (req, res) => {
    const userId = req.params.id;
    const imagePath = path.join(IMAGE_DIR, `${userId}.jpg`);
    const pageUrl = `${DOMAIN}/api/${userId}`;

    try {
        // Verifica si la imagen necesita regenerarse
        if (!fs.existsSync(imagePath) || isImageExpired(imagePath)) {
            // Genera una imagen JPG con el ID del usuario
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
                                    ${userId}
                                </text>
                            </svg>
                        `),
                        top: 0,
                        left: 0,
                    },
                ])
                .jpeg({ quality: 80 }) // Generar en JPG con calidad del 80%
                .toBuffer();

            fs.writeFileSync(imagePath, imageBuffer);
            console.log(`Imagen JPG generada para ID: ${userId}`);
        } else {
            console.log(`Imagen JPG reutilizada para ID: ${userId}`);
        }

        // Responder con una página HTML con metaetiquetas dinámicas
        const imageUrl = `${DOMAIN}/api/images/${userId}.jpg`;
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta property="og:title" content="ID de Usuario: ${userId}" />
            <meta property="og:description" content="Imagen generada para el usuario ${userId}" />
            <meta property="og:image" content="${imageUrl}" />
            <meta property="og:url" content="${pageUrl}" />
            <title>ID de Usuario: ${userId}</title>
        </head>
        <body>
            <h1>ID de Usuario: ${userId}</h1>
            <img src="${imageUrl}" alt="Imagen del usuario ${userId}" />
        </body>
        </html>
        `;

        res.send(html);
    } catch (error) {
        console.error('Error generating the JPG image:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Ruta específica para servir las imágenes generadas
app.get('/api/images/:id.jpg', (req, res) => {
    const imagePath = path.join(IMAGE_DIR, `${req.params.id}.jpg`);

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`API ejecutándose en http://localhost:${PORT}/api/:id`);
});
