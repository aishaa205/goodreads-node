const express = require("express");
const router = express.Router();
const multer = require("multer");
const googleDriveController = require("../controllers/googleDrivecontroller");

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

router.post("/", upload.single("file"), googleDriveController.uploadGoogle);

module.exports = router;