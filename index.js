const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tltii2l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const tools = client.db("toolstore").collection("tools");
        const reviews = client.db("toolstore").collection("reviews");
        const orders = client.db("toolstore").collection("orders");
        const profile = client.db("toolstore").collection("profile");
        app.post('/tools', async (req, res) => {
            const data = req.body;
            const result = await tools.insertOne(data);

            res.send(result)

        })
        app.get('/tools', async (req, res) => {
            const query = {}
            const cursor = tools.find(query)
            const result = await cursor.toArray()
            res.send(result)

        })
        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviews.find(query)
            const result = await cursor.toArray()
            res.send(result)

        })
        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await tools.findOne(query)
            res.send(result)
        })
        app.post("/reviews", async (req, res) => {
            const data = req.body;
            const result = await reviews.insertOne(data);


        })
        app.post("/orders", async (req, res) => {
            const order = req.body
            const result = await orders.insertOne(order);

        })
        app.get("/orders", async (req, res) => {
            const email = req.query
            console.log(email)
            const result = await orders.find(email).toArray()
            res.send(result)
        })
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await orders.deleteOne(query);
            //console.log(result)
            res.send(result)
        })
        app.post('/profile', async (req, res) => {
            const user = req.body;
            const result = await profile.insertOne(user)
            res.send(result)
        })
        app.put('/profile', async (req, res) => {
            const email = req.query
            console.log(email)
            const data = req.body
            const options = { upsert: true };
            const updateDoc = {
                $set: data
            };
            const result = await profile.updateOne(email, updateDoc, options)
            res.send(result)
        })
        app.get('/profile/user', async (req, res) => {
            const email = req.query
            console.log(email)
            const cursor = await profile.findOne(email);
            console.log(cursor)
            res.send(cursor)

        })
        app.get('/profile', async (req, res) => {
            const query = {}
            const cursor = profile.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})