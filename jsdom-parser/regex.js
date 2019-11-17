var boardgradetopic= "NCERT Grade 12  Topic: Comparing Quantities"; 
let topicsearch = boardgradetopic.match(/Topic:/i);

var topicindex = topicsearch.index + 6;
var topic = boardgradetopic.substring(topicindex).trim();
console.log(topic);
let gradesearch = boardgradetopic.match(/Grade/i);
let gradeindex = gradesearch.index + 5;
var grade = boardgradetopic.substring(gradeindex, gradeindex + 3).trim();
console.log(grade);
var board = boardgradetopic.substr(0,boardgradetopic.indexOf(' '));
console.log(board);