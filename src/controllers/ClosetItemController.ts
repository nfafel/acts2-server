import { Item } from '../models';
import { uploadMany } from '../lib/s3Storage';
import { s3 } from '../lib/s3Storage';
import Controller from '../lib/Controller';
import { IImage, IItem } from '../interfaces';

export class ItemController extends Controller {
    public async getOne(req, res) {
        try{
            const item = await Item.findOne({id: req.params.id});
            if (!item) {
                res.status(404).send({
                    code: 404,
                    message: 'Item not found.'
                });
            }
            res.status(200).send(item);
        } catch(err) {
            console.log(err);
            res.status(400).send("Error getting Item")
        }
    }

    public async getByUser(req, res) {
        try{
            const items: IItem[] = await Item.find({userId: req.params.user_id});
            res.status(200).send(items);
        } catch(err) {
            console.log(err);
            res.status(400).send("Error getting Items by User")
        }
    }

    public async getByUniversity(req, res) {
        try{
            const items: IItem[] = await Item.find({ universityId: req.params.university_id });
            res.status(200).send(items);
        } catch(err) {
            console.log(err);
            res.status(400).send("Error getting Items by University")
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
                        // Save the file names into database into Items model
                        const newItemValues: IItem = {
                            images: images,
                            createdAt: new Date(),
                            ...req.body
                        };
                        try {
                            const newItem = await new Item(newItemValues).save();
                            res.status(200).send(newItem);
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
            res.status(400).send("Error Creating Item")
        }
    }

    public async update(req, res) {
        try{
            const updates: IItem = req.body.updates;
            const updatedItem: IItem = await Item.findOneAndUpdate({id: req.body.itemId}, updates, {runValidators: true, new: true });

            if (!updatedItem) {
                res.status(400).send({
                    code: 404,
                    message: 'Item not found',
                });
            }

            res.send(updatedItem);
        } catch(err) {
            console.log(err);
            res.status(400).send("Error Updating Item")
        }
    }

    public async delete(req, res) {
        try{
            const item: IItem = await Item.findOne({id: req.params.id});

            if (!item) {
                res.status(400).send({
                    code: 404,
                    message: 'Item not found',
                });
            }
            
            const params = {
                Bucket: "acts2",
                Delete: {
                    Objects: item.images.map(image => {
                        return {Key: image.key}
                    }), 
                    Quiet: false
                }
            }
            //Check if await below solves the problem of inconsistent adds/deletes: await s3.deleteObjects...
            s3.deleteObjects(params, async(err) => {
                if (err) {
                    console.log(err);
                    res.status(400).send("Error Deleting Item");
                } else {
                    await Item.findOneAndRemove({id: req.params.id});
                    res.send({deletedId: req.params.id});
                }
            });
        } catch(err) {
            console.log(err);
            res.status(400).send("Error Deleting Item");
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