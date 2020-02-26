import { uploadOne, uploadMany } from '../lib/s3Storage';
import { s3 } from '../lib/s3Storage';

exports.uploadOne = async(req, res) => {
    uploadOne( req, res, ( error ) => {
        // console.log( 'requestOkokok', req.file );
        // console.log( 'error', error );
        if( error ){
            console.log( 'errors', error );
            res.status(400).send({ error: error } );
        } else {
            // If File not found
            if( req.file === undefined ){
                console.log( 'Error: No File Selected!' );
                res.send( 'Error: No File Selected' );
            } else {
                // If Success
                const imageName = req.file.key;
                const imageLocation = req.file.location;
                // Save the file name into database into profile model
                
                res.send({
                    image: imageName,
                    location: imageLocation
                });
            }
        }
    });
}

exports.uploadMany = async(req, res) => {
    uploadMany( req, res, ( error ) => {
        // console.log( 'requestOkokok', req.file );
        // console.log( 'error', error );
        if ( error ){
            console.log( 'errors', error );
            res.send({error: error});
        } else {
            // If File not found
            if( req.files === undefined ){
                console.log( 'Error: No Files Selected!' );
                res.json( 'Error: No Files Selected' );
            } else {
                // If Success
                const images = req.files.map(file => file.key);
                const imagesLocation = req.files.map(file => file.location);
                // Save the file name into database into profile model
                
                res.send({
                    images: images,
                    locations: imagesLocation
                });
            }
        }
    });
}

exports.getOne = async(req, res) => {
    //May need to use s3.getObject(params).createReadStream() 
    const params = {
        Bucket: "acts2",
        Key: "1582490074004"
        // Key: get from fetching user closet items in future
    };
    
    s3.getObject(params, (err, data) => {   
        if (err) {
            console.error(err);
        } 
        const imageBuff: Buffer = Buffer.from(data.Body);
        res.send({ image: imageBuff.toString("base64") });
    });
}

exports.getMany = async(req, res) => {
    const promises = req.body.imageKeys.map((key) => {
        const params = {
            Bucket: "acts2",
            Key: key
        };
        return s3.getObject(params).promise();
    });
    Promise.all(promises)
        .then((data: any[]) => {
            const images = data.map((data) => data.Body);
            res.send({images: images});
        })
        .catch((err) => {
            console.log(`Error Getting Images: ${err}`);
            res.status(400).send({message: "Error getting image"})
        });
}

exports.createBucket = async(req, res) => {
    const params = {
        Bucket: "acts3"
    };
    s3.createBucket(params, (err, data) => {
        if (err) {
            console.log(err, err.stack);
            res.status(400).send({message: "Error uploading image"})
        } else {
            console.log('Bucket Created Successfully', data.Location);
            res.send({message: "succesful"});
        }
    });
}