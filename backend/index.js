const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());  // Enables Cross-Origin requests (React frontend will run on a different port)
app.use(express.json());  // Parse JSON request bodies

// API route
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
