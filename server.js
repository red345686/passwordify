const express = require('express');
const cors = require('cors');

const app = express();

const API_URL = 'https://test.stytch.com/v1/passwords/strength_check';
const USERNAME = 'project-test-b1992e7f-8cbc-4344-b0b8-afe5236cf6c5';
const PASSWORD = 'secret-test-BOXgHvXUjlsZzp3WyPMYwYWTP7J-XGeswuE=';

app.use(cors());
app.use(express.json());

app.post('/check-password-strength', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default; // Dynamically import node-fetch
        const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify({ password: req.body.password }),
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to check password strength' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
