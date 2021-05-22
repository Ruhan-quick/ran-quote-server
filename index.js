const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const ObjectId = require("mongodb").ObjectID;
const port = 5000;

const app = express();

app.use(cors());
app.use(express.json());
// ${process.env.DB_PASS}   ${process.env.DB_USER}
const MongoClient = require("mongodb").MongoClient;
// console.log(process.env.DB_PASS, process.env.DB_USER)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oiqme.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const quoteCollection = client.db("ran-quote").collection("savedQuotes");

  app.post("/saveQuote", (req, res) => {
    const sQuote = req.body;
    console.log(sQuote);
    quoteCollection.insertOne(sQuote).then((result) => {
      //console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/savedquotes", (req, res) => {
    //console.log(req.query.email);
    quoteCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  console.log("db connected");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
