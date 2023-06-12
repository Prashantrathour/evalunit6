const express = require("express");
const { postModel } = require("../model/postmodel");
const { auth } = require("../middleware/auth");
const postrouter = express.Router();

postrouter.post("/add",auth, async (req, res) => {
  try {
    const post = new postModel(req.body);
    const postcreate = await post.save();
    res.json({ post: postcreate });
  } catch (error) {
    res.status(404).json({ error });
  }
});

postrouter.get("/",auth, async (req, res) => {
 
    console.log(req.query)
    const page=req.query.page||1
    const limit=req.query.limit||3
    const skip=(page-1)*limit
  try {
    if(req.query){
        const post = await postModel.find(req.query).skip(skip).limit(limit);
        res.json({post:post, limit:limit,page:page});
    }else{
        const post = await postModel.find().skip(skip).limit(limit);
        res.json({post:post, limit:limit,page:page});

    }
  } catch (error) {
    res.status(404).json({ error });
  }
});
postrouter.get("/top",auth, async (req, res) => {
    const page=req.query.page||1
    const limit=req.query.limit||3
    const skip=(page-1)*limit
  try {
    const post = await postModel.find().skip(skip).limit(limit).sort({no_of_comments:-1});
    res.json({post:post, limit:limit,page:page});
  } catch (error) {
    res.status(404).json({ error });
  }
});

postrouter.get("/:id",auth, async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const post = await postModel.findById(id);
    res.json(post);
  } catch (error) {
    res.status(404).json({ error });
  }
});
postrouter.patch("/update/:id",auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;
  try {
    const post = await postModel.findById(id);
    if (userId == post.userId) {
     
      const update = await postModel.findByIdAndUpdate(id, req.body);
      res.json({msg:"updated successfully"});
    } else {
      res.status(404).json({ message: "you are not allowed to update" });
    }
  } catch (error) {
    res.status(404).json({ error:"somthing wrong" });
  }
});
postrouter.delete("/delete/:id",auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;
  try {
    const post = await postModel.findById(id);
    if (userId == post.userId) {
      const deleted = await postModel.findByIdAndDelete(id);
      res.json({msg:"post deleted"});
    } else {
      res.status(404).json({ message: "you are not allowed to delete" });
    }
  } catch (error) {
    res.status(404).json({ error:"no post" });
  }
});

module.exports = { postrouter };
