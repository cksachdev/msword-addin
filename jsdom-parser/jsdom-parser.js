const { JSDOM } = require('jsdom');
const dbConnection = require('./services/dbConnection.js');
const pisaModel = require('./models/pisadoc.model');
const fileLocation = '/Users/saket/Documents/diksha-tools/doc/js-parser-html/js-parser/jsdom-parser/PISA_sample_html.html';
const fs = require('fs');
const html_folder_location = "PISA_sample_html_files";
const initJob = async () => {
    try {
        JSDOM.fromFile(fileLocation)
            .then((dom) => {
                htmlstring = dom.serialize();
                var document = dom.window.document;
                var images = document.getElementsByTagName('img');

                for (var i = 0; i < images.length; i++) {
                    var imgsrc = images[i].src;
                    imgsrcf = imgsrc.replace('file\:\/\/', '');
                    var lastslash = imgsrcf.lastIndexOf("\/");

                    var filestring = imgsrcf.substring(lastslash);

                    var imgstring = html_folder_location + filestring;


                    var bitmap = fs.readFileSync(imgsrcf);
                    // convert binary data to base64 encoded string
                    var imgbase64 = new Buffer(bitmap).toString('base64');
                    var base64image = `data:image/png;base64,${imgbase64}`;

                    htmlstring = htmlstring.replace(imgstring, base64image);

                }
                /* fs.writeFile("base64convert.html", htmlstring, function(err) {

                     if (err) {
                         return console.log(err);
                     }

                     console.log("The base64convert file was saved!");
                 });*/
                const editdom = new JSDOM(htmlstring);
                var editdocument = editdom.window.document;
                const tables = editdocument.getElementsByTagName("table");
                console.log(tables.length);

                for (var i = 0; i < tables.length; i++) {
                    var RowQuestionObj = {};
                    var rows = tables[i].rows;
                    var rowslength = rows.length;
                    RowQuestionObj.Title = tables[i].rows[0].textContent.trim();

                    var contentArray = [];
                    var processArray = [];
                    var levelArray = [];
                    var contextArray = [];
                    var subContextArray = [];

                    for (var meta = 3; meta < rowslength - 2; meta++) {
                        if (tables[i].rows[meta].cells[1]) contentArray.push(tables[i].rows[meta].cells[1].textContent.trim());
                        if (tables[i].rows[meta].cells[2]) processArray.push(tables[i].rows[meta].cells[2].textContent.trim());
                        if (tables[i].rows[meta].cells[3]) levelArray.push(tables[i].rows[meta].cells[3].textContent.trim());
                        if (tables[i].rows[meta].cells[4]) contextArray.push(tables[i].rows[meta].cells[4].textContent.trim());
                        if (tables[i].rows[meta].cells[5]) subContextArray.push(tables[i].rows[meta].cells[5].textContent.trim());
                    }
                    var boardgradetopic = tables[i].rows[rowslength - 3].textContent.trim();
                    let topicsearch = boardgradetopic.match(/Topic:/i);
                    var topicindex = topicsearch.index + 6;
                    RowQuestionObj.topic = boardgradetopic.substring(topicindex).trim();
                    let gradesearch = boardgradetopic.match(/Grade/i);
                    let gradeindex = gradesearch.index + 5;
                    RowQuestionObj.grade = boardgradetopic.substring(gradeindex, gradeindex + 3).trim();
                    RowQuestionObj.board = boardgradetopic.substr(0, boardgradetopic.indexOf(' '));
                    RowQuestionObj.content = contentArray;
                    RowQuestionObj.process = processArray;
                    RowQuestionObj.level = levelArray;
                    RowQuestionObj.context = contextArray;
                    RowQuestionObj.subContext = subContextArray;
                    RowQuestionObj.question = "<HTML><HEAD></HEAD><BODY>" + tables[i].rows[rowslength - 2].innerHTML + "</BODY></HTML>";
                    RowQuestionObj.answer = "<HTML><HEAD></HEAD><BODY>" + tables[i].rows[rowslength - 1].innerHTML + "</BODY></HTML>";
                    /*  if (i === 5) {
                          fs.writeFile(`question${i}.html`, RowQuestionObj.question, function(err) {

                              if (err) {
                                  return console.log(err);
                              }

                              console.log("The question file was saved!");
                          });

                             fs.writeFile(`answer${i}.html`, RowQuestionObj.answer, function(err) {

                                 if (err) {
                                     return console.log(err);
                                 }

                                 console.log("The answer file was saved!");

                             });

                      }*/


                    // console.log("length of rows is : " + rows.length);
                    // console.log(RowQuestionObj);

                    savePisaQuestionToDB(RowQuestionObj, function(err, result) {
                        if (err) {

                            console.log("error saving to db");

                        } else {

                        }
                    });

                }


            })
    } catch (error) {
        logger.error('Error in initJob function => ' + error);
    }
};


function savePisaQuestionToDB(question, cb) {
    try {
        var question = new pisaModel(question);
        question.save(function(err, data) {
            if (err) return cb(err);
            cb(null, data);
        });
    } catch (error) {
        logger.error('Error in saveQuestionToDB function => ' + error);
        cb(error);
    }
}


dbConnection
    .DBConnectMongoose()
    .then(() => {
        initJob();
        // process.exit(0);
    })
    .catch(err => {
        console.log('MongoDB Error: ' + err);
    });