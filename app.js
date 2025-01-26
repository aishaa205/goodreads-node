const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userBookRoutes = require('./routes/userBookRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/insurance-system', {
  
}).then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Could not connect to MongoDB', error));


// UserBooks routes
app.use('/userBook',userBookRoutes);

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
