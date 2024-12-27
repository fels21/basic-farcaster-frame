# Basic Farcaster Frame

A simple web application to generate and serve dynamic images based on user input. Designed to work seamlessly in local environments and on **Vercel**.

## Features

- Generates dynamic images (576x576) with user IDs or app names.
- Caches generated images and regenerates them after 24 hours.
- Serves images dynamically using `/tmp` directory for compatibility with **Vercel**.
- OpenGraph meta tags included for better sharing.

## Routes

### 1. Home Page (`/`)
Displays the app name dynamically with a generated image.

- **Example**:  
  `https://yourdomain.com/`
- **Meta Tags**:
  - `og:title`: App Name
  - `og:description`: App Description
  - `og:image`: Generated image URL
- **Generated Image**: `app-image.jpg`

### 2. API (`/api/:id`)
Generates and serves a dynamic image based on the user ID provided in the URL.

- **Example**:  
  `https://yourdomain.com/api/12345`
- **Meta Tags**:
  - `og:title`: `ID de Usuario: <id>`
  - `og:description`: Description of the user ID
  - `og:image`: URL of the generated image
- **Generated Image**: `<id>.jpg`

### 3. Image Serving (`/api/images/:id.jpg`)
Serves the dynamically generated images stored in `/tmp`.

- **Example**:  
  `https://yourdomain.com/api/images/12345.jpg`

## Local Setup

### Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- TypeScript installed globally (`npm install -g typescript`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/basic-farcaster-frame.git
   cd basic-farcaster-frame
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DOMAIN=http://localhost:3000
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

6. Access the app:
   - Home Page: [http://localhost:3000/](http://localhost:3000/)
   - API Endpoint: [http://localhost:3000/api/12345](http://localhost:3000/api/12345)

### Running in Production (Vercel)

1. Deploy the app using Vercel:
   ```bash
   vercel --prod
   ```

2. Access the deployed application:
   - Home Page: `https://your-vercel-domain.vercel.app/`
   - API Endpoint: `https://your-vercel-domain.vercel.app/api/12345`

## Key Technologies

- **Node.js**: Backend server.
- **Express**: API routing and static file serving.
- **Sharp**: Dynamic image generation.
- **TypeScript**: Strongly typed JavaScript for better maintainability.
- **Vercel**: Deployment and serverless execution.

## Troubleshooting

1. **Images Not Showing on Vercel**
   - Ensure images are served dynamically using the `/api/images/:id.jpg` route.
   - Verify the generated images exist in the `/tmp` directory.

2. **Logs for Debugging**
   - Use the following command to check Vercel logs:
     ```bash
     vercel logs <deployment-url>
     ```

3. **Environment Variables**
   - Set the correct `DOMAIN` in your `.env` file (or Vercel Environment Variables) to match the production URL.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

