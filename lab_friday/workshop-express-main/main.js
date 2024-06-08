const express = require("express")

const app = express()
app.use(express.json())
const port = 4000

var cats = [{id: 1, name: "Coco", color: "black", is_cutie : true}]


app.get("/", (req, res) => {
    res.send("Welcome to the Workshop CATS app!")
})

app.get("/cat", (req, res) => {
    res.send(cats);
})
app.get("/cat/:id", (req, res) =>{
    const cat = cats.find(cat => cat.id === parseInt(req.params.id));
    if(!cat){
        res.status(404).send("Cat not found");
    }
    else{
        res.send(cat);
    }
})
app.post("/cat", (req, res) => {
    const cat = {
        id: cats.length + 1,
        name : req.body.name,
        color : req.body.color,
        is_cutie : req.body.is_cutie
    }
    cats.push(cat);
    res.sendStatus(200);
})

app.listen(port, () => {
    console.log(`Workshop CATS app is running on port ${port}`)
})
