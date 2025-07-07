const express = require("express");
const authRouter = express.Router();

//signup api for signing the user
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
    console.log(checkEmail);
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
