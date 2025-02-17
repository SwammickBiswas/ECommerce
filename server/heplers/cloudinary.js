const cloudinary = require("cloudinary").v2
const multer = require("multer")

cloudinary.config({
    cloud_name: "dmwzs2yu4",
    api_key:"399574549783773",
    api_secret: "mi4UpSfEkiI1DDTq8y_gkWX_XiE"
})

const storage = new multer.memoryStorage()

async function ImageUploadUtil(file) {
        const result = await cloudinary.uploader.upload(file,{
            resource_type: "auto",
        })
        return result
}

const upload = multer({ storage })
module.exports = {upload,ImageUploadUtil}