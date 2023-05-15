const express = require("express")
const contactRoute = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const ContactModel = require("../model/contacts.Model")

contactRoute.get("/", async (req, res) => {
    const userId = req.body.userId;
    // console.log("userID1",userId)
    try {
        const data = await ContactModel.find({ userId: userId });
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

contactRoute.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    // console.log("userID1",userId)
    try {
        const data = await ContactModel.find({ userId: userId });
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

contactRoute.post("/add", async (req, res) => {
    try {
        const data = new ContactModel(req.body);
        await data.save();
        res.send({msg:"data is added"});
    } catch (error) {
        res.send(error);
    }
});

contactRoute.post("/update/:id", async (req, res) => {
   
    const id = req.params.id;
    try {
        const payload = { email: req.body.email, name: req.body.name, number:req.body.number }
        await ContactModel.findByIdAndUpdate(id, { ...payload });
        let UpdatePost = await ContactModel.findById(id);
        res.send({ msg: "Contact Updated", Updated_Post: UpdatePost });
    } catch (e) {
        res.send({ msg: e.message });
    }
})

contactRoute.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
console.log(id)
    try {
        let cart = await ContactModel.findOneAndDelete({ _id:id });
        // console.log("cartid", cart);
        res.status(200).send("Contact deleted");
    } catch (err) {
        res.send({ msg: e.message });
    }
});

module.exports = contactRoute