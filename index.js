const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID
const password = 'NdhGUTJeT9wVru88';

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://organicUser:NdhGUTJeT9wVru88@cluster0.xsirj.mongodb.net/organicdb?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })

    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })

    app.post("/addProduct", (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                console.log("Data added..")
                // res.send('succes')
                res.redirect('/')
            })
    })

    app.patch("/update/:id", (req, res) => {
        console.log(req.body.price)
        productCollection.updateOne({ _id: ObjectId(req.params.id) },
        {
            $set: { price: req.body.price, quantity: req.body.quantity }
        })
        .then(result => {
            res.send(result.modifiedCount > 0)
        })
    })

    app.delete("/delete/:id", (req, res) => {
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })
});


app.listen(3000)