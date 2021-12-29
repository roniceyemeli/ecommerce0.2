const router = require("express").Router();
const cloudinary = require("cloudinary");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const fs = require("fs");

// we will upload image on cloudinary with only admin access  by implemeting middlewares 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//route to upload an image on cloudinary
router.post("/upload", auth, authAdmin, (req, res) => {
  try {
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(402).json("no files uploaded");

    const file = req.files.file;
    if (file.size > 1024 * 1024) {
      rmvTmp(file.tempFilePath);
      return res.status(400).json({ msg: "size too large" });
    }

    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png"){
      rmvTmp(file.tempFilePath)
      return res.status(400).json({ msg: "this file format is not supported" });
    }

    //sending file on cloudinary in a named folder 'upload'
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "upload" },
      async (err, result) => {
        if (err) throw err;

        rmvTmp(file.tempFilePath)
        res.json({ public_id: result.public_id, url: result.secure_url })
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
});

//route to delete an uploaded image
router .post('/erase',auth, authAdmin, (req, res) => {
    try {
        const {public_id} = req.body;
        if(!public_id) return res.status(400).json({ msg: 'you should select an image' })

        cloudinary.v2.uploader.destroy(public_id, async(err, result) => {
            if (err) throw err;
            res.json({msg: "image deleted"})
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

const rmvTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = router;
