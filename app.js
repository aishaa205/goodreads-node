require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
// const userRoutes = require("./routes/userRoutes");
const userBookRoutes = require("./routes/userBookRoutes");
const bookReviews = require("./routes/bookReviewRoutes");
const userCategoryRoutes = require("./routes/userCategoryRoutes");
const siteContentRoutes = require("./routes/siteContentRoutes");
const routes = require("./routes");
const app = express();
const path = require("path");


  
//////////////////////////
// const fs = require("fs");
// const {google} = require("googleapis");
// const multer = require("multer");
// // access json file
// const apikey = require("./apikey.json");

// const SCOPE = ['https://www.googleapis.com/auth/drive'];
// // Authorization to google drive 
// async function authorize(){
//    const jwtClient = new  google.auth.JWT(
//      apikey.client_email,
//      null ,
//      apikey.private_key,
//      SCOPE
//    );
//   await jwtClient.authorize();
//   return jwtClient;

// } 

///////////////da el 2deem
// //upload file to google drive 
// async function uploadFile(authClient){
//   return new Promise((resolve,rejected)=>{
//       const drive = google.drive({version:'v3',auth:authClient}); 

//       // Validate file format
//       if (path.extname('./test.pdf').toLowerCase() !== '.pdf') {
//         return reject(new Error('Only PDF files are allowed!'));
//       }

//       // accept ay file m4 pdf bs
//       var fileMetaData = {
//           name:'',    
//           parents:['16sqCCx5yT5Lrm4TJAcDeXG4RuPJHP-Xv'] //el folder id mn el url bta3 drive
//       }
//       drive.files.create({
//           resource:fileMetaData,
//           media:{
//               body: fs.createReadStream('./test.pdf'), // files that will get uploaded
//               mimeType: 'application/pdf'
//           },
//           fields:'id'
//       },function(error,file){
//           if(error){
//               return rejected(error)
//           }
//           resolve(file);
//       })
//   });
// }
// authorize().then(uploadFile).catch("error",console.error());


///////da el gded

// async function uploadFile(authClient, filePath, fileName) {
//   const drive = google.drive({ version: "v3", auth: authClient });

//   const fileMetaData = {
//       name: fileName,
//       parents: ["16sqCCx5yT5Lrm4TJAcDeXG4RuPJHP-Xv"], 
//   };

//   const media = {
//       mimeType: "application/pdf",
//       body: fs.createReadStream(filePath),
//   };

//   try {
//       const response = await drive.files.create({
//           resource: fileMetaData,
//           media: media,
//           fields: "id",
//       });

//       // Construct file URL
//       const fileId = response.data.id;
//       const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

//       // Delete file from local storage after uploading
//       fs.unlinkSync(filePath);

//       return fileUrl;
//   } catch (error) {
//       console.error("Error uploading file:", error);
//       throw error;
//   }
// }



// app.post("/upload-files", upload.single("pdf"), async (req, res) => {
//   try {
//       if (!req.file) {
//           return res.status(400).json({ message: "No file uploaded!" });
//       }

//       const authClient = await authorize();
//       const fileUrl = await uploadFile(authClient, req.file.path, req.file.originalname);

//       return res.status(200).json({ message: "File uploaded successfully!", fileUrl });
//   } catch (error) {
//       res.status(500).json({ message: "Error uploading file", error });
//   }
// });


// app.listen(3001, () => {
//   console.log("Server is running on port 3001");
// });



/////////
// const multer = require("multer");


// //storege b destination mo3ayan w link
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, "./files");
//   }, 
//   filename: function (req, file, cb) {
//        const uniqueSuffix = Date.now() 
//        cb(null, uniqueSuffix+file.originalname)
//   },
// });
// const upload = multer({ storage: storage })

// app.post("/upload-files",upload.single("file"),async(req,res)=>{
//   console.log(req.file);
//   })


//const passport = require("passport");
//require("./config/passport");
// const authRoutes = require("./routes/auth");

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
const { createAdminUser } = require("./scripts/setup");
const db_link = process.env.MONGO_CONNECTION_STRING;
mongoose
  .connect(db_link)
  .then(() => {
    console.log("Connected to MongoDB");
    createAdminUser();
  })
  .catch((error) => console.error("Could not connect to MongoDB", error));
// Middleware to serve static files from the "views/images" folder
app.use(express.static(path.join(__dirname, "views")));
app.use(cors());
app.use(express.json());

app.use("/categories", categoryRoutes);
app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);
app.use("/bookReviews", bookReviews);
app.use("/usercategories", userCategoryRoutes);
app.use("/siteContent", siteContentRoutes);
// app.use("/users", userRoutes);
//app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use(routes);

// UserBooks routes
app.use("/userBook", userBookRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
