const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const searchRouter = require('./routes/search');
app.use('/api/search', searchRouter);

// Health Check
app.get('/', (req, res) => {
    res.send('Music Streaming API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
