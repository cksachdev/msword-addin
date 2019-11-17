const dbConnection = require('./services/dbConnection.js');
const pisaModel = require('./models/pisadoc.model');
const fs = require('fs');

const testJob = async () => {
    try {

        pisaModel.find({}, function(err, users) {

            fs.writeFile("question1.html", users[2]._doc.question, function(err) {

                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });
            fs.writeFile("answer1.html", users[2]._doc.answer, function(err) {

                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");

            });
        });
    } catch (error) {
        logger.error('Error in initJob function => ' + error);
    }
}

dbConnection
    .DBConnectMongoose()
    .then(() => {
        testJob();

    })
    .catch(err => {
        console.log('MongoDB Error: ' + err);
    });