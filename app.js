const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { text } = require("body-parser");
const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = ["Buy Food", "Cook Food", "Eat Food"];
// let workItems = [];
// Connection to the Mongodb server
mongoose.connect("mongodb+srv://admin-damilare:Worldwar321@cluster0.hh4l8.mongodb.net/todolistDB", {useNewUrlParser:true}); 

//Create todolist DB Schema
const itemsSchema = new mongoose.Schema({
   name:String
});

// Create mongoose model for the schema
const Item = mongoose.model("Item", itemsSchema);

// Create default items to the collection
const item1 = new Item({
   name: "Welcome to your todolist!"
});

const item2 = new Item({
   name: "Click on the + button to add new item!"
});

const item3 = new Item({
   name: "Click on the delete button to delete an item!"
});

const defaultItems = [item1,item2,item3];

// Delete from the collection
// Item.deleteOne({_id:"602918521dc7c7d214ab2d5b"}, function(err){
//    if (err){
//       console.log(err);
//    } else {
//       console.log("Data deleted successfully!")
//    }
// })


// Get requests
app.get("/", function (req, res) {
   // Read from the database
   Item.find({}, function(err, foundItems){
      if (foundItems.length === 0){
        // Adding the defalut items to the collection
         Item.insertMany(defaultItems, function(err){
            if (err){
            console.log(err);
            } else {
            console.log("Items added successfully!");
            }
         });
         res.redirect("/");
      } else  {
         res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
   });
});

// get request the work route
app.get("/work", function (req, res) {
   res.render("list", { listTitle: "Work Lists", newListItems: workItems });
});


// Post requests
app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  // Create new  document to write to the database
  const item = new Item({
     name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
   const checkedItemId = req.body.checkbox;
   console.log(checkedItemId);

   Item.where().findOneAndRemove(checkedItemId, function(err){
      if (!err){
         console.log("Data successfully deleted!");
         res.redirect("/");
      }
   })
});

// post request to the work route
// app.post("/work", function (req, res) {
//    let item = req.body.newItem;
//    workItems.push(item);
//    res.redirect("/work");
// });

// Ports
app.listen(3001, function () {
   console.log("Server running on port 3001");
});
