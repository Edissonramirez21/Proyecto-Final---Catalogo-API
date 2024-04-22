import cloudinaryPackage from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinary = cloudinaryPackage.v2;

//configurar cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,

});
//Crear storage engine for multer
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png", "jpeg"],
    params:{
        folder: "Catalogo-api",
    },
});

//inicializar multer with storage engine
const upload = multer ({ storage: storage });

export default upload;