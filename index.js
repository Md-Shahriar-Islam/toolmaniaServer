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

    }
    finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})