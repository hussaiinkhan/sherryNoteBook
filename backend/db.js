const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://sheryarkhan927:sherry@sherrynotebook.fxlfri9.mongodb.net/?retryWrites=true&w=majority&appName=SherryNoteBook'



function connectToMongo() {

  mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
}

module.exports = connectToMongo;
