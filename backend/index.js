// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dbClient = require('./db'); // Import PostgreSQL client
const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000

const apiKey = process.env.GOOGLE_API_KEY; // Use the API key from environment variables
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

app.use(cors());
app.use(express.json());

// API route
app.post('/optimize', async (req, res) => {
    console.log('Received SQL query:', req.body.sql);
    const originalQuery = req.body.sql;

    // Construct request data for the Google API
    const requestData = {
        contents: [
            {
                parts: [
                    {
                        text: `Optimize the following SQL query and return only the optimized SQL query without any additional text. If optimization is not possible, return the same query back: ${originalQuery}`
                    }
                ]
            }
        ]
    };

    try {
        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('API Response:', response.data);
        const candidates = response.data.candidates;

        let optimizedQuery = originalQuery;
        if (candidates && candidates.length > 0) {
            optimizedQuery = candidates[0].content;
            console.log('Optimized Query:', optimizedQuery);
        } else {
            console.log('No candidates returned.');
        }

        // Execute the original and optimized queries
        const executeQuery = async (query) => {
            try {
                const result = await dbClient.query(query);
                return result.rows;
            } catch (err) {
                console.error('Query execution error:', err);
                return { error: err.message };
            }
        };

        const originalQueryResult = await executeQuery(originalQuery);
        const optimizedQueryResult = await executeQuery(optimizedQuery);

        // Send the results as a response
        res.json({
            originalQueryResult,
            optimizedQueryResult
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
