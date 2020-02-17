const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const config = require('config');
const URL = config.get('default.db_url');
const DB  = config.get('default.db_name');
const COLLECTION = config.get('default.db_collection');

module.exports = (app) => {
    // Smoke Test
    app.get(`/api/test`, async (req, res) => {
        return res.status(200).send("Server Route is Working!");
    });

    app.get(`/api/claim/total`, async (req, res) => {
        console.log(URL);
        console.log("Get total claims archived.");
        const client = await MongoClient.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const total = await client.db(DB).collection(COLLECTION).estimatedDocumentCount();
        console.log(`Successfully found total claims archived: ${total}.`);

        await client.close();

        return res.status(202).send({
            error: false,
            total
        });
    });

    // Get Claim data for specific year
    app.get(`/api/claim/:year`, async (req, res) => {
        let year = req.params.year;
        console.log("Get Request Route for year: " + year);
        let yearInt = parseInt(year);
        let pipeline = [
            {
                '$project': {
                    'year': {
                        '$year': '$fullDocument.dateClaimSubmitted'
                    },
                    'fullDocument.claimType': 1
                }
            }, {
                '$match': {
                    'year': yearInt
                }
            }, {
                '$group': {
                    '_id': '$fullDocument.claimType',
                    'total': {
                        '$sum': 1
                    }
                }
            }, {
                '$sort': {
                    '_id': 1
                }
            }
        ];

        const client = await MongoClient.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const claims = await client.db(DB).collection(COLLECTION).aggregate(pipeline).toArray();
        console.log(`Successfully found claims by year.`);

        await client.close();

        return res.status(202).send({
            error: false,
            claims
        });
    });

    app.get('*', function (req, res) {
        return res.status(404).send("Non-existent route requested.");
    });
};