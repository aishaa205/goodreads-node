const fs = require("fs");
const {google} = require("googleapis");
const multer = require("multer");
// access json file
const apikey = require("../apikey.json");

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
exports.uploadGoogle = async function uploadGoogle(req, res) {
    try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded!" });
        }
    
        const authClient = await authorize();
        const fileUrl = await uploadFile(authClient, req.file.path, req.file.originalname);
    
        // Delete the temporary file after upload
        fs.unlinkSync(req.file.path);
    
        res.status(200).json({ fileUrl });
      } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Failed to upload file", error: error.message });
      }}