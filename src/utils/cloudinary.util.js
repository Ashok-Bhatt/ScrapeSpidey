import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";

const extractPublicId = (url) => {
    const parts = url.split("/");
    const fileWithExtension = parts.pop();  // e.g. "abc123xyz.jpg"
    const withoutExtension = fileWithExtension.split(".")[0]; // "abc123xyz"
    const folderWithCloudName = parts.slice(parts.indexOf("upload") + 1).join("/"); // e.g. "cloud_name/profile_pics"
    const folder = folderWithCloudName.split("/")[1]; // "profile_pics"
    return folder + "/" + withoutExtension;  // "profile_pics/abc123xyz"
}

const uploadFile = async (filePath, folder) => {
    const uploadedResponse = await cloudinary.uploader.upload(filePath, {
        folder: folder,
    });

    fs.unlinkSync(filePath);

    return uploadedResponse.secure_url;
}

const destroyFile = async (url) => {
    const publicId = extractPublicId(url);
    await cloudinary.uploader.destroy(publicId);
}

export {
    uploadFile,
    destroyFile,
};
