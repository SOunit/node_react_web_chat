const multer = require('multer');
const fs = require('fs');
const path = require('path');

exports.useFile = ((req, res, next) => {
  const getFileType = (file) => {
    const mimeType = file.mimetype.split('/');
    return mimeType[mimeType.length - 1];
  };

  const generateFileName = (req, file, cb) => {
    const extention = getFileType(file);

    const fileName = `${Date.now()}_${Math.random() * 1e9}.${extention}`;
    cb(null, `${file.fileName}_${fileName}`);
  };

  const fileFilter = (req, file, cb) => {
    const extention = getFileType(file);

    // reg ex
    const allowedTypes = /jpeg|jpg|png/;

    const passed = allowedTypes.test(extention);

    if (passed) {
      return cb(null, true);
    }

    return cb(null, false);
  };

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { id } = req.user;
      const dest = `uploads/user/${id}`;

      // check path exists
      fs.access(dest, (error) => {
        if (error) {
          // if not exist
          return fs.mkdir(dest, (error) => {
            cb(error, dest);
          });
        } else {
          // if exist
          fs.readdir(dest, (error, files) => {
            if (error) {
              throw error;
            }

            // delete all files
            for (const file of files) {
              fs.unlink(path.join(dest, file), (error) => {
                if (error) {
                  throw error;
                }
              });
            }
          });

          // return cb if no error
          return cb(null, dest);
        }
      });
    },
    filename: generateFileName,
  });

  return multer({ storage, fileFilter }).single('avatar');
})();
