const express = require('express');
const app = express();

// ...existing code...
app.use(express.json()); // add JSON parser middleware
// ...existing code...
