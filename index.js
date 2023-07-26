const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://sophan:sophan%40123@cluster0.r3agzsk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.set({
    "Content-Security-Policy": "default-src 'self'; font-src 'self' data:; img-src 'self' data:; style-src 'self' https://cdn.jsdelivr.net;"
  });
  next();
});
app.get('/', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('Fruit');
        const collection = database.collection('Fruits');
        const images = await collection.find({}).toArray();
        res.json(images);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while retrieving images from the database.');
    } finally {
        await client.close();
    }
});
app.post('/insert', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('Fruit');
        const collection = database.collection('Buyer_Data');
        const data = req.body;
        data.date = new Date();
        await collection.insertOne(data);
        res.status(201).send('Data inserted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while inserting data into the database.');
    } finally {
        await client.close();
    }
});



app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
