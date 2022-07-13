const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vfr7x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    // console.log('connect');
    const database = client.db("testDb");
    const services = database.collection("services");
    //get
    app.get('/services', async (req, res) => {
      const cursor = services.find({});
      const result = await cursor.toArray();
      res.send(result);

    })
    // get single
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await services.findOne(query);

      //   const user = users[id];
      res.send(result);

    })

    // post
    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await services.insertOne(service);
      // console.log(result);

      res.json(result);
      // delete
      app.delete('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await services.deleteOne(query);

        //   const user = users[id];
        res.send(result);

      })

    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



const handler = (req, res) => {
  res.send('Hello World!');
}
app.get('/', handler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})