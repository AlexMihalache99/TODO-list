const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

mongoose.connect("mongodb+srv://yolo123:test123@cluster0.ee2vmwc.mongodb.net/todolistDB");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome!"
});

const item2 = new Item({
    name: "Hit +!"
});

const item3 = new Item({
    name: "Yolo!"
});

const defaultItems = [item1, item2, item3];


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){

    var day = date.getDate();

    Item.find({}, function(err, foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Success");
                }
            });
            res.redirect("/");
        }else{
            res.render("list", {day: day, newItems: foundItems});
        }

    });


});

app.post("/", function(req, res){

    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });

    item.save();

    res.redirect("/");
});

app.post("/delete", function(req, res){

    const checkItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkItemId, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Success deleted");
            res.redirect("/");
        }
    });

});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
});