require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dbClient = require('./db'); // Import PostgreSQL client
const {
    optimizeQuery,
    generateDbGenQueries,
    profileQueryExecution
} = require('./apiService'); // Import the new API service module

const { queryExtractor } = require('./utils')
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API route
app.post('/optimize', async (req, res) => {
    console.log('Received SQL query:', req.body.sql);
    const originalQuery = req.body.sql;

    try {
        // Step 1: Optimize the original query
        const optimizedQuery = await optimizeQuery(originalQuery);
        console.log('Optimized Query:', optimizedQuery.parts[0].text);

        // Step 2: Generate dbgen queries
        const dbGenOriginal = await generateDbGenQueries(originalQuery);
        const dbGenOptimized = await generateDbGenQueries(optimizedQuery.parts[0].text);

        console.log('dbGen Original Query:', dbGenOriginal);
        console.log('dbGen Optimized Query:', dbGenOptimized);

        extractedOriginalQuery = queryExtractor(dbGenOriginal)
        extractedOptimizedQuery = queryExtractor(dbGenOptimized)
        // Step 3: Profile the execution of both queries
        const originalProfile = await profileQueryExecution(extractedOriginalQuery);
        const optimizedProfile = await profileQueryExecution(extractedOptimizedQuery);

        // Send profiling results as a response
        res.json({
            optimizedQuery,
            originalProfile,
            optimizedProfile
        });
    } catch (error) {
        console.error('Error in /optimize route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
