import { Component } from "@angular/core";
import { NGXLogger } from "ngx-logger";
const template = require("./app.component.html");
import { JSDOM } from "jsdom";

@Component({
  selector: "app-home",
  template
})
export default class AppComponent {
  welcomeMessage = "Welcome to Word Parser";
  async run() {
    return Word.run(async context => {
      var htmlbody = context.document.body.getHtml();

      await context.sync();
      console.log("dsfdsfdf");
      const jsdom = new JSDOM(htmlbody);
      const { document } = jsdom.window;
      const tables = document.getElementsByTagName("table");
      console.log(tables.length);
      type RowQuestion = {
        Title: string;
        topic: string;
        grade: string;
        board: string;
        content: Array<string>;
        process: Array<string>;
        level: Array<string>;
        context: Array<string>;
        subContext: Array<string>;
      };
      for (var i = 0; i < tables.length; i++) {
        var RowQuestionObj = {} as RowQuestion;
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
        RowQuestionObj.board = boardgradetopic.substr(0, boardgradetopic.indexOf(" "));
        RowQuestionObj.content = contentArray;
        RowQuestionObj.process = processArray;
        RowQuestionObj.level = levelArray;
        RowQuestionObj.context = contextArray;
        RowQuestionObj.subContext = subContextArray;
        // RowQuestionObj.question =tables[i].rows[rowslength - 2].innerHTML;
        // RowQuestionObj.answer =tables[i].rows[rowslength - 1].innerHTML;
      }
    });
  }
}
