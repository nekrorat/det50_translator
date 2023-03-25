const vision = require('@google-cloud/vision');

//* TEST OR PROD
const isGoogleCloudEnv = !!process.env.NODE_ENV
let client;
if (isGoogleCloudEnv) {
    //* PROD
    // vision
    client = new vision.ImageAnnotatorClient({
        projectId: process.env.PROJECT_ID,
        keyFilename: process.env.KEY_FILENAME
      });

} else {
    //* LOCAL
    require('dotenv').config();
    const GOOGLE_AUTH = JSON.parse(process.env.GOOGLE_AUTH);

    // vision
    client = new vision.ImageAnnotatorClient({
        projectId: GOOGLE_AUTH.project_id,
        credentials: {
            client_email: GOOGLE_AUTH.client_email,
            private_key: GOOGLE_AUTH.private_key
        }
    });
}


// text detection
const picToText = async (ctx, inputFile) => {
    const request = {
        "requests": [{
            "image": {
                "source": {
                    "imageUri": inputFile
                }
            },
            "features": [{
                "type": "DOCUMENT_TEXT_DETECTION"
            }],
            "imageContext": {
                "languageHints": [ctx.session.from || '']
            }
        }]
    };

    // Performs text detection on the local file
    const [result] = await client.batchAnnotateImages(request);
    return result.responses[0].fullTextAnnotation.text;
}

module.exports = {
    picToText
};