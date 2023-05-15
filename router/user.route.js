const express = require("express")
const userRouter = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const UserModel = require("../model/userModel")

userRouter.get("/", async (req, res) => {
    try {
        const data = await UserModel.find()
        res.send(data)
    } catch (e) {
        res.send(e)
    }
})

userRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body
    console.log(req.body);
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                console.log(err);
            } else {
                let ExistingUser = await UserModel.findOne({ email: email })
                if (ExistingUser) {
                    res.send("User Already Exists, Try Login!")
                } else {
                    const newUser = new UserModel({ name, email, password: hash, })
                    await newUser.save()
                    res.status(201).send({ msg: "New User Added", user: newUser })
                }
            }
        })
    } catch (e) {
        console.log(e);
        res.send(`Registration Error: - ${e}`)
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        let User = await UserModel.find({ email: email })
        // console.log(User)
        if (User.length > 0) {
            bcrypt.compare(password, User[0].password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userId: User[0]._id }, process.env.key);
                    res.status(201).send({ msg: `Welcome ${User[0].name}`, token: token , id:User[0]._id});
                } else {
                    res.send({ msg: "Wrong Password" })
                }
            })
        } else {
            res.send({ msg: `Email ${email} does not Exist. Try Registering` })
        }
    } catch (e) {
        res.send({ msg: "Error", reason: e })
    }
})

userRouter.post("/loginadmin", async (req, res) => {
    const { email } = req.body
    try {
        let User = await UserModel.find({ email: email })
        // console.log(User)
        if (User.length > 0) {

            let token = jwt.sign({ userId: User[0]._id }, process.env.key);
            res.status(201).send({ msg: `Welcome ${User[0].name}`, token: token });
        } else {
            res.send({ msg: "Wrong Password" })
        }
    } catch (e) {
        res.send({ msg: "Error", reason: e })
    }
})

userRouter.post("/update/:id", async (req, res) => {

    const id = req.params.id;
    try {

        const salt = bcrypt.genSaltSync(5);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const payload = { email: req.body.email, name: req.body.name, password: hash }
        await UserModel.findByIdAndUpdate(id, { ...payload });
        let UpdatePost = await UserModel.findById(id);
        res.send({ msg: "User Updated", Updated_Post: UpdatePost });
    } catch (e) {
        res.send({ msg: e.message });
    }
})

userRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        let cart = await UserModel.findOneAndDelete({ _id: id });
        // console.log("cartid", cart);
        res.status(200).send("Contact deleted");
    } catch (err) {
        res.send({ msg: e.message });
    }
});

// userRouter.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/login');
// });

module.exports = userRouter