const { MongoClient } = require('mongodb');
const URI = 'mongodb://localhost:27017/NutriAI'; // Replace with your URI

async function connect() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('mydb'); // Returns the database object
  } catch (err) {
    console.error('Connection error:', err);
  }
}   

module.exports = connectDB;