// uJlbiuCAwK3RWJyO


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

console.log(uri)
const run = async () => {
   try{
      await client.connect()
      const database = client.db("bootKingdom");
      const bootCollection = database.collection("boots")

      // GET API for all the boots of bootCollection
      app.get('/boots', async (req, res) => {
         const query = {}
         const cursor = bootCollection.find(query)
         const boots = await cursor.toArray()
         res.send(boots)
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