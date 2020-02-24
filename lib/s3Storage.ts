import config from '../config';

import * as aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import multer from 'multer';
import * as path from 'path';

export const publicACL = 'public-read';
export const privateACL = 'bucket-owner-full-control';

function checkFileType( file, cb ){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );
    if( mimetype && extname ){
        return cb( null, true );
    } else {
        cb( 'Error: Images Only!' );
    }
}

// AWS S3 interface object
export const s3 = new aws.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
});

// multer AWS S3 configuration
export const ms3 = multerS3({
    s3: s3,
    bucket: "acts2",
    acl: privateACL,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file: any, cb) => {
        cb(null, Date.now().toString());
    },
});

export const uploadOne = multer({
    storage: ms3,
    limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function( req, file, cb ){
        checkFileType( file, cb );
    }
}).single('image');

export const uploadMany = multer({
    storage: ms3,
    limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function( req, file, cb ) {
        checkFileType( file, cb );
    }
}).array('images', 8);