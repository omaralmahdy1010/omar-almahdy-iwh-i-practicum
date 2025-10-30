require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


const PORT = process.env.PORT || 3000;
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const CUSTOM_OBJECT = '2-194002536'; // ✅ your Pets custom object

// 🏠 Homepage - show list of custom object records
app.get('/', async (req, res) => {
  try {
    // 👇 Explicitly request specific properties
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}?properties=name,type,bio`,
      {
        headers: { Authorization: `Bearer ${HUBSPOT_API_KEY}` }
      }
    );

    const records = response.data.results;

    // Log to verify the data being returned
    console.log("🐾 Retrieved Pets:", records.map(r => r.properties));

    res.render('homepage', { title: 'Pets Custom Object', records });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Error fetching custom object records.');
  }
});

// 📋 Show form to create a new record
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Add a New Pet | Integrating With HubSpot I Practicum' });
});

// 💾 Handle form submission
app.post('/update-cobj', async (req, res) => {
  const { name, bio, type } = req.body;

  try {
    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}`,
      { properties: { name, bio, type } },
      { headers: { Authorization: `Bearer ${HUBSPOT_API_KEY}` } }
    );
    res.redirect('/');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Error creating custom object record.');
  }
});

app.listen(PORT, () => console.log(`🚀 App running on http://localhost:${PORT}`));
