const express = require("express");
const userModel = require("../models/user.model");
const userrouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * components:
 *     schema:
 *       user:
 *        type:object
 *         properties:
 *          id:
 *           type:string
 *            description:this is automatically generated
 *            name:
 *            type:string
 *            description:the user name
 *            email:
 *            type:string
 *            description:the user email
 *            password:
 *            type:string
 *            description:the user password
 *
 *
 */
/**
* @swagger
* tags:
* name: Users
* description: All the API routes related to User
*/

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *                 example: Leanne Graham
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *                 example: leanne@gmail.com
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: password123
 *     responses:
 *       201:
 *         description: New user created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user ID.
 *                   example: 0
 *                 name:
 *                   type: string
 *                   description: The user's name.
 *                   example: Leanne Graham
 *                 email:
 *                   type: string
 *                   description: The user's email.
 *                   example: leanne@gmail.com
 *                 password:
 *                   type: string
 *                   description: The user's email.
 *                   example: leanne@gmail.com
 */


userrouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (password) {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.status(404).json({ message: err.message });
      } else {
        try {
          const userbcrpt = { name, email, password: hash };
          const user = new userModel(userbcrpt);
          const userregister = await user.save();
          res.json({ message: "user registed", userregister });
        } catch (error) {
          res.status(404).json({ message: error });
        }
      }
    });
  } else {
    res.status(404).json({ message: "password must be at least" });
  }
});
/**
 * @swagger
 * components:
 *     schema:
 *       user:
 *        type:object
 *         properties:
 *          id:
 *           type:string
 *            description:this is automatically generated          
 *            email:
 *            type:string
 *            description:the user email
 *            password:
 *            type:string
 *            description:the user password
 *
 *
 */
/**

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *                 example: leanne@gmail.com
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: password123
 *     responses:
 *       201:
 *         description: New user created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user ID.
 *                   example: 0
 *                 email:
 *                   type: string
 *                   description: The user's email.
 *                   example: leanne@gmail.com
 */
userrouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const userfind = await userModel.findOne({ email });
    console.log(userfind.email);
    if (userfind.name) {
      bcrypt.compare(password, userfind.password, async (err, result) => {
        console.log(result, password, userfind.password);
        if (err) {
          res.status(404).json({ error: err.message });
        } else if (result) {
          const token = jwt.sign(
            { userId: userfind._id, userName: userfind.name },
            process.env.SECRATE_KEY,
            { expiresIn: "5days" }
          );
          const rtoken = jwt.sign({ email }, process.env.SECRATE_KEY_REFRESH, {
            expiresIn: "7days",
          });
          res.json({ token, rtoken });
        } else {
          res.status(404).json({ error: "wrong credentials" });
        }
      });
    } else {
      res.status(404).json({ error: `user not find` });
    }
  } else {
    res
      .status(404)
      .json({
        error: ` ${
          !password ? "enter password" : "" + !email ? "enter email" : ""
        }`,
      });
  }
});

module.exports = userrouter;
