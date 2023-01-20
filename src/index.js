// const adminRoutes = require("./routes/adminRoutes");
// const db = require("./config/db");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const express = require("express");

const mongoClient = require("mongodb").MongoClient;
const router = express.Router();

const asyncHandler = require("express-async-handler");
const app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,auth-token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "key", cookie: { maxAge: 6000000 } }));
app.use("/api/admin", router);
const state = {
  db: null,
};
const collection = {
  GALLERY_COLLECTION: "gallery",
  CLIENTS_COLLECTION: "clients",
};

const connect = function (done) {
  //mongo url
  const url =
    "mongodb+srv://asifsaheer:asifsaheer@cluster0.j3g9az8.mongodb.net/?retryWrites=true&w=majority";
  mongoClient.connect(url, (err, data) => {
    if (err) return done(err);

    //mongoDB name
    const dbname = "Green-Corps";
    state.db = data.db(dbname);
  });
  done();
};
const get = function () {
  return state.db;
};

const PORT = process.env.PORT || 8000;
connect((err) => {
  if (err) {
    console.log("connection error" + err);
  } else {
    console.log("database connected");
  }
});

function verifyToken(req, res, next) {
  let authHeader = req.headers["auth-token"];
  if (authHeader == undefined) {
    res.status(401).send({ erorr: "no token provided" });
  }
  let token = authHeader;
  Jwt.verify(token, "asif", (err, res) => {
    if (err) {
      console.log("Unautherized");
      //  res.status(500).send("Authentication Failed")
    } else {
      next();
    }
  });
}
const generateToken = (id) => {
  return jwt.sign({ id }, "asif", {
    expiresIn: "30d",
  });
};
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
  const obj = req.body;
  const add = get().collection("gallery").insertOne(obj);
  if (add) {
    res.status(200).json("Success");
  } else {
    res.status(500).json("Somthing Went Wrong");
  }
});
const viewAllGallery = asyncHandler(async (req, res) => {
  const AllGallery = await get().collection("gallery").find().toArray();
  if (AllGallery) {
    res.status(200).json(AllGallery);
  } else {
    res.status(201).json("Gallery Empty");
  }
});
const DeleteGallery = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const deleteGallery = await get()
    .collection("gallery")
    .deleteOne({ _id: ObjectId(id) });
  if (deleteGallery) {
    res.status(200).json(deleteGallery);
  } else {
    res.status(500).json("Something Went Wrong ");
  }
});

const AddClients = asyncHandler((req, res) => {
  const obj = req.body;

  const add = get().collection("clients").insertOne(obj);
  if (add) {
    res.status(200).json("Success");
  } else {
    res.status(500).json("Somthing Went Wrong");
  }
});
const ViewAllClients = asyncHandler(async (req, res) => {
  const AllDoctors = await get().collection("clients").find().toArray();
  if (AllDoctors) {
    res.status(200).json(AllDoctors);
  } else {
    res.status(201).json("Gallery Empty");
  }
});
const DeleteClients = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const deleteDoctors = await get()
    .collection("clients")
    .deleteOne({ _id: ObjectId(id) });
  if (deleteDoctors) {
    res.status(200).json(deleteDoctors);
  } else {
    res.status(500).json("Something Went Wrong ");
  }
});
router.route("/login").post(Login);
router.route("/addGallery").post( AddGallery);
router.route("/viewAllGallery").get(viewAllGallery);
router.route("/deleteGallery/:id").delete( DeleteGallery);
router.route("/addClients").post( AddClients);
router.route("/deleteClients/:id").delete(DeleteClients);
router.route("/viewAllClients").get(ViewAllClients);

app.listen(PORT, console.log(`server started on PORT ${PORT}`));
