const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 3000;
app.use(bodyParser.json());

const { spliter } = require("./index");

client.connect();
const db = client.db("engine");
const pagesCollection = db.collection("pages");

app.get("/", (req, res) => res.status(200).send("Hello"));

app.get("/search", async (req, res) => {
  const term = req.query.q;
  const page = await pagesCollection.find({ terms: term }).toArray();
  return res.status(200).send(page);
});


app.post("/crawl", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).send("Title and content are required");
  }
  await pagesCollection.insertOne({ title, terms: spliter(content) });
  res.status(200).send("done");
});

app.listen(PORT, () => {
  console.log(`Server is running on localhost://${PORT}`);
});
