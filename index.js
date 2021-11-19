
const express = require('express')
const {MongoClient} = require('mongodb')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 4000
const ObjectId = require('mongodb').ObjectId


//Middlewire
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z46cs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const run = async () => {
   try{
      await client.connect()
      const database = client.db("bootKingdom");
      const bootCollection = database.collection("boots")
      const orderCollection = database.collection("orders")
      const feedbackCollection = database.collection("feedbacks")
      const usersCollection = database.collection("users")

      // GET API for all the boots of bootCollection
      app.get('/boots', async (req, res) => {
         const query = {}
         const cursor = bootCollection.find(query)
         const boots = await cursor.toArray()
         res.send(boots)
      })


      // GET API for all the boots of bootCollection
      app.get('/feedbacks', async (req, res) => {
         const query = {}
         const cursor = feedbackCollection.find(query)
         const feedbacks = await cursor.toArray()
         res.send(feedbacks)
      })

      // GET API for a specific boot
      app.get('/boots/:id', async (req, res) => {
         const id = req.params.id
         const query = {_id: ObjectId(id)}
         const boot = await bootCollection.findOne(query)
         res.send(boot)
      })

      // GET API to read all the orders
      app.get('/orders', async (req, res) => {
         const query = {}
         const cursor = orderCollection.find(query)
         const orders = await cursor.toArray()
         res.send(orders)
      })

      // GET API to read orders for specific user
      app.get(`/orders/:email`, async (req, res) => {
         const email = req.params.email
         const query = {email: email}
         const cursor = orderCollection.find(query)
         const orders = await cursor.toArray()
         res.send(orders)
      })

      // GET API to verify admin
      app.get(`/users/:email`, async (req, res) => {
         const email = req.params.email
         const query = {email: email}
         const user = await usersCollection.findOne(query)
         res.send(user)
      })

      // POST API for a single order
      app.post('/orders', async (req, res) => {
         const newBook = req.body
         const result = await orderCollection.insertOne(newBook)
         res.send(result)
      })

      // POST API for a product
      app.post('/boots', async (req, res) => {
         const newProduct = req.body
         const result = await bootCollection.insertOne(newProduct)
         res.send(result)
      })

      // POST API for a Feedback
      app.post('/feedbacks', async (req, res) => {
         const newFeedback = req.body
         const result = await feedbackCollection.insertOne(newFeedback)
         
         res.send(result)
      })

      // POST API for a User
      app.post('/users', async (req, res) => {
         const newUser = req.body
         const result = await usersCollection.insertOne(newUser)
         console.log(newUser)
         res.send(result)
      })

      // UPDATE API for a User
      app.put('/users', async (req, res) => {
         const newUser = req.body
         const filter = { email: newUser.email };
         const options = { upsert: true };
         const updateDoc = {
            $set: newUser,
         };
         const result = await usersCollection.updateOne(filter, updateDoc, options)
         
         res.send(result)
      })

      app.put('/users/admin', async (req, res) => {
         const user = req.body
         const filter = {email: user.email}
         const updateDoc = {
            $set: {
              role: `admin`
            },
         }
         console.log(user)
         const result = await usersCollection.updateOne(filter, updateDoc)
         res.send(result)
      })

      // DELETE API for a specifit order
      app.delete(`/orders/:id`, async (req, res) => {
         const id = req.params.id
         console.log(id)
         const query = {_id: ObjectId(id)}
         const result = await orderCollection.deleteOne(query)
         res.send(result)
      })

      // DELETE API for a specifit order
      app.delete(`/boots/:id`, async (req, res) => {
         const id = req.params.id
         console.log(id)
         const query = {_id: ObjectId(id)}
         const result = await bootCollection.deleteOne(query)
         res.send(result)
      })

      // UPDATE API for a order to be confirmed
      app.put(`/orders/:id`, async (req, res) => {
         const id = req.params.id
         const modifiedOrder = req.body
         const filter = {_id: ObjectId(id)}
         const options = { upsert: false }
         const updateDoc = {
            $set: {
              orderStatus: modifiedOrder.orderStatus
            },
         }
         const result = await orderCollection.updateOne(filter, updateDoc, options);
         res.send(result)
      })

   }
   finally{

   }
}

run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})