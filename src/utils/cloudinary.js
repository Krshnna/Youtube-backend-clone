// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";




// const UploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     console.log("File is uploaded", response);
//     return response;
//   } catch (error) {
//     fs.unlinkSync(localFilePath);
//     return null;
//   }
// };
// export default UploadOnCloudinary;


import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET 
// });
          
cloudinary.config({ 
  cloud_name: 'dm4te935a', 
  api_key: '994755216792626', 
  api_secret: 'IbipxEgN8J-ZJrrgWr14oj0INwk' 
});

const UploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
      console.log(error);
        fs.unlinkSync(localFilePath) 
        return null;
    }
}



export default UploadOnCloudinary;