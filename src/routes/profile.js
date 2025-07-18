const express = require("express");
const profileRouter = express.Router();
const{validateEditProfileData} = require("../utils/validation");
const {userAuth} = require("../middlewares/auth");

//profile API to get the profile details
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      user
    })
  } catch (error) {
    res.status(400).send("Error"+ error.message)
  }
});

//profile Edit Api//
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    Objects.keys(req.user).forEach(
      (key) => (loggedInUser[key] = req.body[key])
    );
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName},your profile updated Successfully`,
      data: loggedInUser,
    });
  } catch (error) {}
});


module.exports = profileRouter;