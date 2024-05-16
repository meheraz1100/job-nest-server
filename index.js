const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://job-n-est.web.app'],
  credentials : true,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bgw1n6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const jobCollection = client.db('jobDB').collection('job');
    const appliedJobCollection = client.db('jobDB').collection('appliedjobs');



    app.get('/addJob', async (req, res) => {
      const cursor = jobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.post('/addJob', async (req, res) => {
        const newJob = req.body;
        console.log(newJob);
        const result = await jobCollection.insertOne(newJob);
        res.send(result);
    })


    app.delete('/addJob/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    })



    app.get('/addJob/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await jobCollection.findOne(query);
      res.send(result);
    })

    app.put('/addJob/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedJob = req.body;
      const job = {
        $set: {
          job_banner: updatedJob.job_banner,
          job_catagory: updatedJob.job_catagory ,
          job_title: updatedJob.job_title,
          job_description: updatedJob.job_description,
          posting_date: updatedJob.posting_date,
          application_deadline: updatedJob.application_deadline,
          salary_range: updatedJob.salary_range
        }
      }
      const result = await jobCollection.updateOne(filter, job, options);
      res.send(result);
    })


    // applied jobs
    app.post("/appliedjobs", async(req, res) => {
      const appliedjob = req.body;
      console.log(appliedjob);
      const result = await appliedJobCollection.insertOne(appliedjob);
      res.send(result);
    })

    app.get('/appliedjobs', async (req, res) => {
      const cursor = appliedJobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.delete('/appliedjobs/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await appliedJobCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/appliedjobs/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const result = await appliedJobCollection.findOne(query);
      res.send(result);
    })

    







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('career is running');
})


app.listen(port, () => {
    console.log(`career is running on ${port}`)
})
