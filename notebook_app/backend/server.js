const mongoose = require('mongoose');


const express = require('express');

const bodyParser = require('body-parser');

const logger = require('morgan');

const Data = require('./data');

const API_PORT = 3001;

const app = express();

const router = express.Router();


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://PDAnSuxbBassqost:PDAnSuxbBassqost@notebook.0vp7l.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

let db = client.connection;

app.use(bodyParser.urlencoded({ extended: false } ));

app.use(bodyParser.json());

app.use(logger("dev"));

router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data:data });
  });
});

router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ sucess: true });
  });
});

router.post("/putData", (req, res) => {
  let data = new Data();
  
  const { id, message } = req.body;
  
  if ((!id && id !== 0 ) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  
  data.message = message;
  data.save(err => {
    if (err) return res.json({ success: false, error: err});
    return rse.json({ success: true });
  });
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

    