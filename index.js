const express = require('express');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;


require('dotenv').config();
const cors = require('cors');

const app =express();
const port = 5000;

app.use(cors());
app.use(express.json());


const uri =
`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqb56.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
async function run() {
    try {
      await client.connect();
      const database = client.db('carMechanics');
      const servicesCollection = database.collection('services');
      //GET API
      app.get('/services', async(req, res)=>{
          const cursor = servicesCollection.find({});
          const services = await cursor.toArray();
          res.send(services);
      });

      //Get single service
      app.get('/services/:id',async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service);
      });

      //UPDATE API
      app.put('/services/:id', async(req, res)=>{
        const id = req.params.id;
        // console.log('hiting the update',id);
        const updateService = req.body;
        const filter = {_id:ObjectId(id)};
        const options = {upsert:true};
        const updateDoc = {
          $set: {
            name:updateService.name,
            price:updateService.price,
          },
        };
        const result = await servicesCollection.updateOne(filter, updateDoc, options);
        res.json(result)
      })

      //DELETE API
      app.delete('/services/:id',async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await servicesCollection.deleteOne(query);
        res.json(result);
      });


      //POST API
      app.post('/services',async(req, res)=>{
        const services = req.body;
        const result = await servicesCollection.insertOne(services);
        res.json(result);
      })
       

    }
     finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('backend server runing');
});

app.listen(port, ()=>{
    console.log('runing the backend server',port);
})