export const postUnivData = async(req, res) => {
    const University = require('./models/university');
    const fs = require('fs') 
    
    try{
        await University.deleteMany({});
        fs.readFile('univData.csv', async(err, data) => { 
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