import { IUniversity } from '../interfaces/IUniversity';
import { University } from '../models';
import Controller from '../lib/Controller';

export default class UniversityController extends Controller {

    public async getSearchResults(req, res) {
        try {
            const universities: IUniversity = await University.find({name: {$regex : req.params.search, $options: "i"}}).limit(10);
            res.send({universities: universities})
        } catch(err) {
            console.log(err);
            res.status(400).send({message: "Error getting results"})
        }
    }

    protected initializeRoutes(): void {
        this.router.get('/:search', this.getSearchResults);
    }

}