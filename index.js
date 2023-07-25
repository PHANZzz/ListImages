const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const multer = require('multer');

// Replace with your MongoDB connection URL
const uri = "mongodb+srv://sophan:sophan%40123@cluster0.r3agzsk.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(console.log("DB Connected"))
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage });

// Define the Mongoose schema for the Image model
var imageSchema = new mongoose.Schema({
	name: String,
	img:
	{
		data: Buffer,
		contentType: String
	},
	price: Number
});

// Create the Image model using the schema
var Image = mongoose.model('Image', imageSchema);

app.get('/', async (req, res) => {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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

app.get('/', (req, res) => {
	Image.find({})
	.then((data, err)=>{
		if(err){
			console.log(err);
			res.status(500).json({ error: err });
		}
		res.json(data);
	})
});


app.post('/api/upload', upload.single('image'), (req, res, next) => {

	var obj = {
		name: req.body.name,
		img: {
			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
			contentType: 'image/png'
		},
		price: req.body.price
	}
	Image.create(obj)
	.then ((item, err) => {
		if (err) {
			console.log(err);
			res.status(500).json({ error: err });
		}
		else {
			res.json(item);
		}
	});
});

// Replace with your desired port number
var port = 3000;
app.listen(port, err => {
	if (err)
		throw err
	console.log('Server listening on port', port)
})
