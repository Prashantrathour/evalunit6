const express = require("express");
const noteModel = require("../models/note.model");
const auth = require("../middlewares/auth.middleware");

const noterouter = express.Router();
noterouter.use(auth)

/**
 * @swagger
 * components:
 *   schemas:
 *     Notes:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID (automatically generated).
 *         title:
 *           type: string
 *           description: The note title.
 *         body:
 *           type: string
 *           description: The note body.
 *         category:
 *           type: string
 *           description: The note category.
 */

/**
 * @swagger
 * /notes/create:
 *   post:
 *     summary: Create a new note.
 *     security:
 *       - token: [Bearer ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notes'
 *     responses:
 *       201:
 *         description: Note created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notes'
 *     securitySchemes:
 *       token:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 *         description: Bearer token to access the API.
 */




noterouter.post('/create',async(req,res)=>{
    try {
       
        const note = new noteModel(req.body);
        const noteregister = await note.save();
        res.json({ message: "note registed", noteregister });
      } catch (error) {
        res.status(404).json({ message: error });
      } 
})


/**
 * @swagger
 * components:
 *   schemas:
 *     Notes:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The note ID.
 *           example: 0
 *         title:
 *           type: string
 *           description: The note title.
 *           example: Leanne Graham
 *         body:
 *           type: string
 *           description: The note body.
 *           example: Leanne Graham
 *         category:
 *           type: string
 *           description: The note category.
 *           example: Leanne Graham
 *         userName:
 *           type: string
 *           description: The note user name.
 *           example: Leanne Graham
 *         userId:
 *           type: string
 *           description: The note user ID.
 *           example: Leanne Graham
 */

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Retrieve a list of notes.
 *     description: Retrieve a list of notes from JSONPlaceholder. Can be used to populate a list of fake notes when prototyping or testing an API.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notes'
 */


noterouter.get('/',async(req,res)=>{


    try {
      const note=await noteModel.find()
      res.json({note})
    } catch (error) {
      res.status(404).json({message: error.message})
    }
  
})
noterouter.get('/:id',async(req,res)=>{
  const id=req.params.id
  console.log(id)
  if(id) {
    try {
      const note=await noteModel.findById(id)
      res.json({note})
    } catch (error) {
      res.status(404).json({message: error.message})
    }
  }else{

    try {
      const note=await noteModel.find()
      res.json({note})
    } catch (error) {
      res.status(404).json({message: error.message})
    }
  }
})
noterouter.patch('/update/:id',async(req,res)=>{
  const {id}=req.params
  const usersideId=req.body.userId
  try {
    const note = await noteModel.findById(id)
    console.log("-------",usersideId,note,id,"--------")
    if(usersideId==note.userId) {
      const update=await noteModel.findByIdAndUpdate({_id:id},req.body)
      
      res.json({msg:'updated notes'})
    }else{
      res.status(404).send({msg:"error updating becouse not authorized"})
    }

  } catch (error) {
    res.status(404).send({msg:error.message})
  }

})
noterouter.delete('/delete/:id',async(req,res)=>{
  const {id}=req.params
  const usersideId=req.body.userId
  try {
    const note = await noteModel.findOne({_id:id})
    if(usersideId==note.userId) {
      const update=await noteModel.findByIdAndDelete({_id:id})
      console.log(usersideId,note.userId)
      res.json({msg:"deleted"})
    }else{
      res.status(404).send({msg:"error delete becouse not authorized"})
    }

  } catch (error) {
    res.status(404).send({msg:error.message})
  }
})
module.exports=noterouter