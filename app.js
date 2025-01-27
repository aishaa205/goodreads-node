const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userBookRoutes = require('./routes/userBookRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://enghusseinsaad1:cCxlORhhU68ziVmn@cluster0.6auvi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  
}).then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Could not connect to MongoDB', error));


// UserBooks routes
app.use('/userBook',userBookRoutes);

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
