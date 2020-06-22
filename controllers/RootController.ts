import { IUniversity } from '../interfaces/IUniversity';
import { University } from '../models';
import Controller from '../lib/Controller';

export default class RootController extends Controller {

    public async healthCheck(req, res): Promise<void> {
        res.status(200).send({
            app: process.env.PACKAGE_NAME,
            version: process.env.PACKAGE_VERSION,
            ci_build_id: process.env.CI_BUILD_ID || null,
            env: {
                aws_account_key: process.env.AWS_ACCOUNT_KEY || null,
                node_env: process.env.NODE_ENV,
                se_env: process.env.SE_ENV || null,
            },
            log_level: process.env.LOG_LEVEL,
        });
    }

    public async initializeUniversityData(req, res): Promise<void> {
        const University = require('./models/university');
        const fs = require('fs') 
        
        try{
            await University.deleteMany({});
            fs.readFile('../initializeUnivData/univData.csv', async(err, data) => { 
                const dataString: string = data.toString();
                const dataByLine: string[] = dataString.split("\n");
                var line: any;
                for (line of dataByLine) {
                    var parsedLine: string[] = line.split(",");
                    parsedLine.splice(2);
                    const newUniv = new University({name: parsedLine[1].replace(/\"/g, "")});
                    console.log(newUniv);
                    await newUniv.save();
                }
            })
            res.send("universities saved successfully");
        } catch(err) {
            console.log(err)
            res.status(400).send("error saving university data");
        }
    }    

    protected initializeRoutes(): void {
        this.router.get('/', this.healthCheck);

        this.router.post('/UnivData', this.initializeUniversityData);
    }

}