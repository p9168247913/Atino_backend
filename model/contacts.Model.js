const mongoose = require("mongoose")

const contactSchema = mongoose.Schema({
    name: String,
    email: String,
    number: String,
    userId:String,
    contactId:String
})

const ContactModel=mongoose.model("contact", contactSchema)
module.exports=ContactModel