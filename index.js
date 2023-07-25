const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://sophan:sophan%40123@cluster0.r3agzsk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('images');
        const images = await collection.find({}).toArray();
        res.json(images);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while retrieving images from the database.');
    } finally {
        await client.close();
    }
});


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
