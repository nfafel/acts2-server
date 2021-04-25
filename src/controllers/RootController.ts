// import { IUniversity } from '../interfaces/IUniversity';
import { University } from '../models';
import fs from 'fs';
import Controller from '../lib/Controller';

export class RootController extends Controller {

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
        try{
            await University.deleteMany({});
            const buffer = fs.readFileSync('initializeUnivData/univData.csv');

            const dataString: string = buffer.toString();
            const dataByLine: string[] = dataString.split("\n");
            dataByLine.map(line => {
                var parsedLine: string[] = line.split(",");
                parsedLine.splice(2);
                const newUniv = new University({name: parsedLine[1].replace(/\"/g, "")});
                return newUniv.save();
            });

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