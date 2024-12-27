# Basic Farcaster Frame

A simple Node.js and TypeScript application that provides a dynamic OpenGraph-compatible API and a home page, both suitable for integration with Farcaster frames. The application generates OpenGraph meta tags and serves dynamically created images based on user input.

## Features

- Dynamic OpenGraph metadata for user-specific pages.
- Static OpenGraph metadata for the homepage.
- Automatically generated images with user ID or application name.
- Configurable domain and port via environment variables.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/basic-farcaster-frame.git
   cd basic-farcaster-frame
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```env
   DOMAIN=https://yourdomain.com
   PORT=3000
   ```

## Scripts

### Build

Compile the TypeScript files:
```bash
npm run build
```

### Start

Run both the API and the homepage servers:
```bash
npm run start
```

Run individual servers:
- API:
  ```bash
  npm run start:api
  ```
- Homepage:
  ```bash
  npm run start:home
  ```

### Development

Run the application in development mode with live reload:
```bash
npm run dev
```

Run individual servers in development mode:
- API:
  ```bash
  npm run dev:api
  ```
- Homepage:
  ```bash
  npm run dev:home
  ```

## Folder Structure

```
.
├── dist/                 # Compiled JavaScript files
├── src/                  # TypeScript source files
│   ├── api.ts           # API server implementation
│   ├── home.ts          # Homepage server implementation
├── .env                  # Environment variables
├── package.json          # Project configuration and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## API Endpoints

### `GET /`

Serves the homepage with OpenGraph meta tags and a dynamically generated image featuring the application name.

### `GET /api/:id`

Generates a page for the provided user ID with:
- OpenGraph meta tags for the ID.
- A dynamically created image displaying the user ID.

**Example:**
```bash
curl http://localhost:3000/api/12345
```

## Environment Variables

- `DOMAIN`: The base URL for OpenGraph meta tags (e.g., `https://yourdomain.com`).
- `PORT`: The port for the application (default: `3000`).

## Contributing

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to your fork:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

