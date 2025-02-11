require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
// const userRoutes = require("./routes/userRoutes");
const userBookRoutes = require("./routes/userBookRoutes");
const userCategoryRoutes = require("./routes/userCategoryRoutes");
const siteContentRoutes = require("./routes/siteContentRoutes");
const routes = require("./routes");
const googleDriveRoutes =  require("./routes/googleDriveRoutes");
const app = express();
const path = require("path");
app.use(cors());
  

//////////////////////////
const fs = require("fs");
const {google} = require("googleapis");
const multer = require("multer");
// access json file
const apikey = require("./apikey.json");

const SCOPE = ['https://www.googleapis.com/auth/drive'];
// Authorization to google drive 
async function authorize(){
   const jwtClient = new  google.auth.JWT(
     apikey.client_email,
     null ,
     apikey.private_key,
     SCOPE
   );
  await jwtClient.authorize();
  return jwtClient;
} 
//storege b destination mo3ayan w link
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "./uploads_files");
  }, 
  filename: function (req, file, cb) {
       const uniqueSuffix = Date.now() 
       cb(null, uniqueSuffix+file.originalname)
  },
});
const upload = multer({ storage: storage })

async function uploadFile(authClient, filePath, fileName) {
  const drive = google.drive({ version: "v3", auth: authClient });

  const fileMetaData = {
    name: fileName,
    parents: ["16sqCCx5yT5Lrm4TJAcDeXG4RuPJHP-Xv"], 
  };

  const media = {
    mimeType: "application/pdf",
    body: fs.createReadStream(filePath),
  };

  try {
    const response = await drive.files.create({
      resource: fileMetaData,
      media: media,
      fields: "id",
    });

    const fileId = response.data.id;
    //console.log("response",response);
    //kda el file accessible
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // embedded link
    //const fileUrl = `https://drive.google.com/file/d/${fileId}/preview`;
     const fileUrl = `https://drive.google.com/file/d/${fileId}/preview`;


    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
          if (err) {
              console.error('Error deleting file:', err);
          } else {
              console.log('File deleted successfully');
          }
      });
  } else {
      console.error('File does not exist:', filePath);
  }
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}




// (async () => {
//   try {
//     const authClient = await authorize();
//     const filePath = "./pdf.pdf"; // Local file path
//     const fileName = "File123.pdf"; // Desired name in Google Drive

//     const fileUrl = await uploadFile(authClient, filePath, fileName);
//     console.log("Embedded File Link:", fileUrl);
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// })();



app.use("/upload", googleDriveRoutes);



// const passport = require("passport");
// require("./config/passport");
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

app.use(express.json());

app.use("/categories", categoryRoutes);
app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);
app.use("/usercategories", userCategoryRoutes);
app.use("/siteContent", siteContentRoutes);
// app.use("/users", userRoutes);
//app.use(passport.initialize());
app.use(routes);

// UserBooks routes
app.use("/userBook", userBookRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
