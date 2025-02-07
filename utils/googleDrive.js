// const fs = require("fs");
// const {google} = require("googleapis");
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

/////////////da el 2deem
//upload file to google drive 
// async function uploadFile(authClient){
//   return new Promise((resolve,rejected)=>{
//       const drive = google.drive({version:'v3',auth:authClient}); 

//       // Validate file format
//       if (path.extname('./test.pdf').toLowerCase() !== '.pdf') {
//         return reject(new Error('Only PDF files are allowed!'));
//       }

//       // accept ay file m4 pdf bs
//       var fileMetaData = {
//           name: '',    
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


/////da el gded

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



// const { google } = require("googleapis");

// const uploadFileToDrive = async (fileBuffer, fileName, mimeType) => {
//   try {
//     const auth = new google.auth.GoogleAuth({
//       keyFile: "path/to/your/google-drive-credentials.json", // Replace with actual path
//       scopes: ["https://www.googleapis.com/auth/drive"],
//     });

//     const drive = google.drive({ version: "v3", auth });

//     const fileMetadata = {
//       name: fileName,
//       parents: ["16sqCCx5yT5Lrm4TJAcDeXG4RuPJHP-Xv"], // Replace with your actual folder ID
//     };

//     const media = {
//       mimeType,
//       body: Buffer.from(fileBuffer),
//     };

//     const response = await drive.files.create({
//       resource: fileMetadata,
//       media,
//       fields: "id",
//     });

//     return `https://drive.google.com/uc?id=${response.data.id}`;
//   } catch (error) {
//     console.error("Error uploading file to Google Drive:", error);
//     return null;
//   }
// };

// module.exports = { uploadFileToDrive };
