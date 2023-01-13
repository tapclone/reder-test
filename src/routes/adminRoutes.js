const express = require("express");
const router = express.Router();
const {verifyToken}=require("../middelware/jwtToken")
const { Login, AddBlog, DeleteBlog, viewAllBlog, AddGallery,viewAllGallery ,DeleteGallery,AddDoctors,ViewAllDoctors,DeleteDoctors, AddClients, DeleteClients, ViewAllClients} = require("../controls/adminControls");

router.route("/login").post(Login);
router.route("/addGallery").post(verifyToken,AddGallery)
router.route("/viewAllGallery").get(viewAllGallery)
router.route("/deleteGallery/:id").delete(verifyToken,DeleteGallery)
router.route('/addClients').post(verifyToken,AddClients)
router.route('/deleteClients/:id').delete(verifyToken,DeleteClients)
router.route('/viewAllClients').get(ViewAllClients)

module.exports = router;
