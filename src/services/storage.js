const {
    Storage
} = require('@google-cloud/storage')
// other
const request = require('request');

//* TEST OR PROD
const isGoogleCloudEnv = !!process.env.NODE_ENV
let storage;
if (isGoogleCloudEnv) {
    //* PROD
    storage = new Storage({
        projectId: process.env.PROJECT_ID,
        keyFilename: process.env.KEY_FILENAME
      });

} else {
    //* LOCAL
    require('dotenv').config();
    const GOOGLE_AUTH = JSON.parse(process.env.GOOGLE_AUTH);

    // cloud storage
    storage = new Storage({
        projectId: GOOGLE_AUTH.project_id,
        credentials: {
            client_email: GOOGLE_AUTH.client_email,
            private_key: GOOGLE_AUTH.private_key
        }
    });
}

// create a file on cloud storage
const createFile = (fileId, fileExt) => {
    return storage.bucket('translate-bot-321419').file(`ocr-temp/${Date.now()}-${fileId}.${fileExt}`)
}

// stream file from url to cloud storage
const uploadblob = (url, file, callback) => {
    request.head(url, (err, res, body) => {
        request(url)
            .pipe(file.createWriteStream())
            .on('finish', callback);
    });
};

// get a file
const downloadFile = async (file) => {
    // Downloads the file
    return await storage.bucket('translate-bot-321419').file(file).download();
}

// delete a file
const deleteFile = async (file) => {
    return await storage.bucket('translate-bot-321419').file(file).delete();
  }

module.exports = {
    createFile,
    uploadblob,
    downloadFile,
    deleteFile
};

//? CLOUD STORAGE UPLOAD +++++

// async function uploadFile() {
//   await storage.bucket(bucketName).upload(filePath, {
//     destination: destFileName,
//   });

//   console.log(`${filePath} uploaded to ${bucketName}`);
// }

//? CLOUD STORAGE UPLOAD -----