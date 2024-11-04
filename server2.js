const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Email leak check endpoint
app.get('/api/leakcheck', async (req, res) => {
    const email = req.query.email;
    try {
        const response = await axios.get(`https://leakcheck.io/api/public?check=${email}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from LeakCheck API:', error);
        res.status(500).json({ error: 'Error fetching data from LeakCheck API' });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));