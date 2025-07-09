const express = require("express");
const authRouter = express.Router();

//signup api 
authRouter.post("/signup", async (req, res) => {
  try {
    //Validate the data
    validateSignupData(req);
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      about,
      skills,
    } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const checkEmail = await User.findOne({ emailId });
    if (checkEmail) {
      throw new Error("Email Already Exist");
    }

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      about,
      skills,
    });
    const savedUser = await user.save();
    const token = await savedUser.getjwt();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res
      .status(200)
      .json({ message: "User added successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

//login api//
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const token = await user.getjwt();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).json({ user });
    } else {
      throw new Error("Invalid Vredentials");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

//logout api//
authRouter.post("/logout", async (req, res) => {
  res.cookie("token, null", {
    expires: new Date(Date.now()),
  });
  res.send("logout Successfull");
});



module.exports = authRouter;


