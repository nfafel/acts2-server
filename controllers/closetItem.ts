import { IClosetItem } from "../interfaces/IClosetItem";
const ClosetItem = require('../models/closetItem');
import { uploadMany } from '../lib/s3Storage';
import { s3 } from '../lib/s3Storage';
import { IClosetItemWImage } from "../interfaces/IClosetItemWImage";

exports.getOne = async(req, res) => {
    try{
        const closetItem: IClosetItem = await ClosetItem.findById(req.params.id);
        
        const promises = closetItem.imageKeys.map((key: string) => {
            const params = {
                Bucket: "acts2",
                Key: key
            };
            return s3.getObject(params).promise();
        });
        Promise.all(promises)
            .then((data: any[]) => {
                const images = data.map((data) => {
                    const imageBuff: Buffer = Buffer.from(data.Body);
                    return {base64: imageBuff.toString("base64")};
                });
                const response: IClosetItemWImage = {
                    closetItem: closetItem,
                    images: images
                };
                res.send({data: response});
            })
    } catch(err) {
        console.log(err);
        res.status(400).send("Error getting Closet Item")
    }
}

exports.getByUser = async(req, res) => {
    try{
        const closetItems: IClosetItem[] = await ClosetItem.find({username: req.params.username});
        const nestedPromiseData: any[] = closetItems.map((item: IClosetItem) => {
            return {
                closetItem: item,
                imagePromises: item.imageKeys.map(key => {
                    const params = {
                        Bucket: "acts2",
                        Key: key
                    };
                    return s3.getObject(params).promise();
                })
            }
        });

        var closetItemsWImages: IClosetItemWImage[] = [];
        Promise.all(nestedPromiseData.map(async(promiseData) => {
            const data = await Promise.all(promiseData.imagePromises);

            const images = data.map((data: any) => {
                const imageBuff: Buffer = Buffer.from(data.Body);
                return {base64: imageBuff.toString("base64")};
            });
            const item: IClosetItemWImage = {
                closetItem: promiseData.closetItem,
                images: images
            };
            closetItemsWImages.push(item);
        })).then(() => {
            res.send({closetItems: closetItemsWImages});
        });
    } catch(err) {
        console.log(err);
        res.status(400).send("Error getting Closet Items by User")
    }
}

exports.getByUniversity = async(req, res) => {
    try{
        const closetItems: IClosetItem[] = await ClosetItem.find({universityId: req.params.universityId, publicity: {$ne: "private"} });
        const nestedPromiseData: any[] = closetItems.map((item: IClosetItem) => {
            return {
                closetItem: item,
                imagePromises: item.imageKeys.map(key => {
                    const params = {
                        Bucket: "acts2",
                        Key: key
                    };
                    return s3.getObject(params).promise();
                })
            }
        });

        var closetItemsWImages: IClosetItemWImage[] = [];
        Promise.all(nestedPromiseData.map(async(promiseData) => {
            const data = await Promise.all(promiseData.imagePromises);

            const images = data.map((data: any) => {
                const imageBuff: Buffer = Buffer.from(data.Body);
                return {base64: imageBuff.toString("base64")};
            });
            const item: IClosetItemWImage = {
                closetItem: promiseData.closetItem,
                images: images
            };
            closetItemsWImages.push(item);
        })).then(() => {
            res.send({closetItems: closetItemsWImages});
        });
    } catch(err) {
        console.log(err);
        res.status(400).send("Error getting Closet Items by University")
    }
}

exports.post = async(req, res) => {
    try{
        uploadMany( req, res, async( error ) => {
            if ( error ){
                console.log( 'errors', error );
                res.status(400).send({error: error});
            } else {
                // If File not found 
                if( req.files === undefined ){
                    console.log( 'Error: No Files Selected!' );
                    res.send( 'Error: No Files Selected' );
                } else {
                    // If Success
                    const imageKeys = req.files.map(file => file.key);
                    // Save the file names into database into closetItems model
                    const newItemValues: IClosetItem = {
                        imageKeys: imageKeys,
                        createdAt: new Date(),
                        ...req.body
                    };
                    const newItem = new ClosetItem(newItemValues);
                    const closetItem: IClosetItem = await newItem.save();
                    res.send({newItem: closetItem});
                }
            }
        });
    } catch(err) {
        console.log(err);
        res.status(400).send("Error Creating Closet Item")
    }
}

exports.put = async(req, res) => {
    try{
        const updates: IClosetItem = req.body.updates;
        const result: IClosetItem = ClosetItem.findByIdAndUpdate(req.body.closetItemId, updates, {useFindAndModify: false, runValidators: true, new: true });
        res.send({updatedItem: result});
    } catch(err) {
        console.log(err);
        res.status(400).send("Error Creating Closet Item")
    }
}

exports.delete = async(req, res) => {
    try{
        const closetItem: IClosetItem = await ClosetItem.findById(req.params.id);
        const params = {
            Bucket: "acts2",
            Delete: {
                Objects: closetItem.imageKeys.map(key => {
                    return {Key: key}
                }), 
                Quiet: false
            }
        }
        s3.deleteObjects(params, async(err) => {
            if (err) {
                console.log(err);
                res.status(400).send("Error Deleting Closet Item");
            } else {
                await ClosetItem.findByIdAndRemove(req.params.id);
                res.send({deletedId: req.params.id});
            }
        });
    } catch(err) {
        console.log(err);
        res.status(400).send("Error Deleting Closet Item");
    }
}