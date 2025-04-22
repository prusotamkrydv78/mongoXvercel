require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use Express EJS Layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Contact Form' });
});

app.post('/submit', async (req, res) => {
  try {
    const { name, address } = req.body;

    // Create a new contact
    const newContact = new Contact({
      name,
      address
    });

    // Save to database
    await newContact.save();

    // Redirect to success page
    res.redirect('/success');
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'There was an error saving your information.'
    });
  }
});

app.get('/success', (req, res) => {
  res.render('success', { title: 'Success' });
});

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.render('contacts', { title: 'All Contacts', contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'There was an error fetching contacts.'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
