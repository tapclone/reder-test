const asyncHandler = require("express-async-handler");
const db = require("config/db");
const collection = require("config/collection");
const generateToken = require("utils/jwtToken");
const { ObjectId } = require("mongodb");
const { GALLERY_COLLECTION } = require("config/collection");
const {CLIENTS_COLLECTION} = require ('config/collection')

const Login = asyncHandler(async (req, res) => {

  const { username, password } = req.body;
  if (username == "green_corps" && password == "1234567890") {
    const token = generateToken(password);

    res.status(200).json(token);
  } else {
    res.status(401).json("Invalid Details");
  }
});






const AddGallery = asyncHandler((req, res) => {

  const obj = req.body
  const add = db.get().collection(GALLERY_COLLECTION).insertOne(obj)
  if (add) {
    res.status(200).json("Success")   
  } else {
    res.status(500).json("Somthing Went Wrong")
  }     
})
const viewAllGallery = asyncHandler(async (req, res) => {
  const AllGallery = await db.get().collection(GALLERY_COLLECTION).find().toArray()
  if (AllGallery) {
    res.status(200).json(AllGallery)
  } else {
    res.status(201).json("Gallery Empty")
  }
})
const DeleteGallery=asyncHandler(async(req,res)=>{
  const id=req.params.id
  const deleteGallery=await db.get().collection(GALLERY_COLLECTION).deleteOne({_id:ObjectId(id)})
 if(deleteGallery){
  res.status(200).json(deleteGallery)
 }else{
  res.status(500).json("Something Went Wrong ")
 }
})

const AddClients = asyncHandler((req, res) => {

  const obj = req.body

  const add = db.get().collection(CLIENTS_COLLECTION).insertOne(obj)
  if (add) {
    res.status(200).json("Success")
  } else {
    res.status(500).json("Somthing Went Wrong")
  }
})
const ViewAllClients = asyncHandler(async (req, res) => {
  const AllDoctors = await db.get().collection(CLIENTS_COLLECTION).find().toArray()
  if (AllDoctors) {
    res.status(200).json(AllDoctors)
  } else {
    res.status(201).json("Gallery Empty")
  }
})
const DeleteClients =asyncHandler(async(req,res)=>{
  const id=req.params.id
  const deleteDoctors=await db.get().collection(CLIENTS_COLLECTION).deleteOne({_id:ObjectId(id)})
 if(deleteDoctors){
  res.status(200).json(deleteDoctors)
 }else{
  res.status(500).json("Something Went Wrong ")
 }
})

module.exports = { Login, AddGallery,viewAllGallery ,DeleteGallery,AddClients,ViewAllClients,DeleteClients};
