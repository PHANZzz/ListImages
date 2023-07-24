const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://sophan:sophan%40123@cluster0.r3agzsk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
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
app.post('/upload', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('images');
        const { name, price, image } = req.body;
        await collection.insertOne({ name, price, image });
        res.status(201).send('Image uploaded successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while uploading the image to the database.');
    } finally {
        await client.close();
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
