const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');

const app = express();

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
// support parsing of application/json type post data
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

// DB Config
const db = require('./config/database').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(port, () => console.log(`Server running on port ${port}`));

app.get('/', (req, res) => res.json({msg: 'Backend is working'}));

// Use Routes
app.use('/api/users', users);