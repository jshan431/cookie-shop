const multer = require('multer');
const uuid = require('uuid/v1');

// helper used to extract the extension of incoming file
const MIME_TYPE_MAP = {
  // mimetypes will look like the keys which will give us the correct extension
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}

// A middleware that has a configuration object passed as an argument to multer
const fileUpload = multer({
  limits: 500000,       //upload limit in bytes
  storage: multer.diskStorage({   //control how data should be stored
    destination: (req, file, cb) => {     // destination of where the file is to be stored
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {        // contol file name that is used
      const ext = MIME_TYPE_MAP[file.mimetype]
      cb(null, uuid() + '.' + ext);       //generate a unique file name with correct extension
    }
  }),
  fileFilter: (req, file, cb) => {    // for preventing wrong file formats
    // if the correct mimetype is not found we get undefined. So placing `!!`
    // in front of something undefined will return false. And a defined thing as true
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});

module.exports = fileUpload;