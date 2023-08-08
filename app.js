const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json({limit: "1mb"}));

app.get("/",(req,res)=>{
    res.render("index");
})

const uri = "mongodb+srv://krmahato:newranger@cluster0.f6qstn1.mongodb.net/historyDB?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const myDB = client.db("historyDB");
const myColl = myDB.collection("History");
let resultVal;

async function run() {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run();

async function addElement(exp,expResult) {
    const doc = { expression: exp, result: expResult };
    resultVal = await myColl.insertOne(doc);
    console.log(
        `A document was inserted with the _id: ${resultVal.insertedId}`,
    );
}

async function removeAllElement() {
    const doc = {};
    resultVal = await myColl.deleteMany(doc);
    console.log(`All data from a collection has been deleted.`);
}

app.post('/submit', (req, res) => {
    let data = req.body.data;
    let result = req.body.result;
    // console.log(req.body);
    addElement(data,result);
    res.sendStatus(201);
});

app.post('/deleteAll', (req, res) => {
    removeAllElement();
    res.sendStatus(201);
});

app.get("/history", async (req,res)=>{
    const result = await myColl.find();
    res.send({"history": result})
})

app.listen("3001",()=>{
    console.log("Server started at 3001");
});
