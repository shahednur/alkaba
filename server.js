const app = require('./src/app'); // Import the app
const http = require('http');

const PORT = process.env.PORT || 3000;

// Create an HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
