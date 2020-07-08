import { IClosetItem } from "../interfaces/IClosetItem";
import { ClosetItem } from '../models';
import { uploadMany } from '../lib/s3Storage';
import { s3 } from '../lib/s3Storage';
import Controller from '../lib/Controller';
import { IImage } from "../interfaces";

export class ClosetItemController extends Controller {
    public async getOne(req, res) {
        try{
            const closetItem = await ClosetItem.findOne({id: req.params.id});
            if (!closetItem) {
                res.status(404).send({
                    code: 404,
                    message: 'Closet Item not found.'
                });
            }
            res.status(200).send(closetItem);
        } catch(err) {
            console.log(err);
            res.status(400).send("Error getting Closet Item")
        }
    }

    public async getByUser(req, res) {
        try{
            const closetItems: IClosetItem[] = await ClosetItem.find({user_id: req.params.user_id});
            res.status(200).send(closetItems);
        } catch(err) {
            console.log(err);
            res.status(400).send("Error getting Closet Items by User")
        }
    }

    public async getByUniversity(req, res) {
        try{
            const closetItems: IClosetItem[] = await ClosetItem.find({universityId: req.params.university_id, publicity: {$ne: "private"} });
            res.status(200).send(closetItems);
        } catch(err) {
            console.log(err);
            res.status(400).send("Error getting Closet Items by University")
        }
    }

    public async create(req, res) {
        try{
            //Check if await below solves the problem of inconsistent adds/deletes: await uploadMany...
            uploadMany(req, res, async( error ) => {
                if ( error ){
                    console.log( 'errors', error );
                    res.status(400).send({error: error});
                } else {
                    // If File not found 
                    if( req.files === undefined ){
                        console.log('Error: No Files Selected!');
                        res.status(400).send({
                            code: 400,
                            message: 'Error: No Files Selected',
                        });
                    } else {
                        // If Success
                        const images: IImage[] = req.files.map(file => ({
                            key: file.key,
                            url: file.location
                        }));
                        // Save the file names into database into closetItems model
                        const newItemValues: IClosetItem = {
                            images: images,
                            createdAt: new Date(),
                            ...req.body
                        };
                        try {
                            const newClosetItem = await new ClosetItem(newItemValues).save();
                            res.status(200).send(newClosetItem);
                        } catch(err) {
                            console.log(err);
                            res.status(400).send({
                                code: 400,
                                name: err.name,
                                message: err.errmsg,
                            });
                        }
                        
                    }
                }
            });
        } catch(err) {
            console.log(err);
            res.status(400).send("Error Creating Closet Item")
        }
    }

    public async update(req, res) {
        try{
            const updates: IClosetItem = req.body.updates;
            const result: IClosetItem = await ClosetItem.findOneAndUpdate({id: req.body.closetItemId}, updates, {runValidators: true, new: true });
            res.send({updatedItem: result});
        } catch(err) {
            console.log(err);
            res.status(400).send("Error Creating Closet Item")
        }
    }

    public async delete(req, res) {
        try{
            const closetItem: IClosetItem = await ClosetItem.findOne({id: req.params.id});
            const params = {
                Bucket: "acts2",
                Delete: {
                    Objects: closetItem.images.map(image => {
                        return {Key: image.key}
                    }), 
                    Quiet: false
                }
            }
            //Check if await below solves the problem of inconsistent adds/deletes: await s3.deleteObjects...
            s3.deleteObjects(params, async(err) => {
                if (err) {
                    console.log(err);
                    res.status(400).send("Error Deleting Closet Item");
                } else {
                    await ClosetItem.findOneAndRemove({id: req.params.id});
                    res.send({deletedId: req.params.id});
                }
            });
        } catch(err) {
            console.log(err);
            res.status(400).send("Error Deleting Closet Item");
        }
    }

    protected initializeRoutes(): void {
        this.router.get('/:id', this.getOne);
        this.router.get('/:user_id/user', this.getByUser);
        this.router.get('/:university_id/university', this.getByUniversity);

        this.router.post('/', this.create);

        this.router.put('/:id', this.update);

        this.router.delete('/:id', this.delete);
    }
}