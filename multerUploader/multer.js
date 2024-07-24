import multer from 'multer';
import path from 'path';





const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function (req, file, callback) {

        req['file_name'] = file.originalname;

        callback(null, file.originalname);
    },

});

const upload = multer({ storage: storage }); `x`

export default upload;
