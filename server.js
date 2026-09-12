const express = require('express');
const axios = require('axios');
const cors = require('cors');
const redis = require('redis');

const redisclient = redis.createClient();
redisclient.on('error', (error) => console.error('Redis error:', error.message));
const DEFAULT_EXPIRATION=3600
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/screenshots', async (req, res) => {
    const albumId = req.query.albumId;
    
    const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        {params: { albumId }}
    );
    console.log(data);
    if (redisclient.isReady) {
        await redisclient.setEx('screenshots', DEFAULT_EXPIRATION, JSON.stringify(data));
    }

    res.json(data);
});

app.get('/screenshots/:id', async (req, res) => {
    const { id } = req.params;

    const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        {params: { id }}
    );

    res.json(data);
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});