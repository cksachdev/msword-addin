import { Component } from "@angular/core";
import { NGXLogger } from "ngx-logger";
const template = require("./app.component.html");
/* global require, Word */

@Component({
  selector: "app-home",
  template
})
export default class AppComponent {
  welcomeMessage = "Welcome to Word Parser";
  /*
TableCollection:
TableRowCollection:


*/
  async run() {
    return Word.run(async context => {
      var range = context.document.getSelection();
      var html = range.getHtml();
      let firstCell = context.document.body.tables.getFirst().getCell(0, 0).body;
      // let t2firstCell = context.document.body.tables.getFirst().getNext()

      const tableCollection = context.document.body.tables;
      // let myImages = context.document.body.inlinePictures;
        const firstPicture = context.document.body.inlinePictures.getFirst();
                    context.load(firstPicture);
 const base64 = firstPicture.getBase64ImageSrc();
                    await context.sync();
                    console.log("This is base 64 value :" + base64.value);


      // context.load(myImages);  
      // await context.sync();
       // if (myImages.items.length > 0) console.log(myImages.items[0].value());
      context.load(tableCollection);
      await context.sync();
            
            
      console.log("length of tables collection : " + tableCollection.items.length);
      for (var i = 0; i < tableCollection.items.length; i++) {
        var theTable = null;
        theTable = tableCollection.items[i];

        var cell1 = theTable.values[0][0];

        await context.load(theTable, "");
        await context.sync();
        var tabledata: string[][] = theTable.values;
        // insertTableInNewDoc(tabledata);
        await context.sync();
        // var myNewDoc = context.application.createDocument();
        // context.load(myNewDoc);
        context
          .sync()
          .then(function() {})
          .catch(function(myError) {
            //otherwise we handle the exception here!
            //   myNewDoc.open();
            console.log("Error", myError.message);
          });
        var tablerow = theTable.rows;
        console.log(" Table data is : " + tabledata + typeof tabledata);
        console.log("Row data is : " + JSON.stringify(tablerow) + typeof tablerow);
        if (tabledata[0].constructor === Array) console.log("tabledata is 2d array as expected");
        console.log("Table " + i + " row count is: " + theTable.rowCount.toString());
        console.log("First cell value for " + i + "table is " + cell1);

        // get all the table data
        for (var i = 0; i < tabledata.length; i++) {
          var rowdata = tabledata[i];
          for (var j = 0; j < rowdata.length; j++) {
            console.log("table[" + i + "][" + j + "] = " + rowdata[j]);
          }
        }
      }
    });
  }
}
function insertTableInNewDoc(tableData) {
  return Word.run(async context => {
    var myNewDoc = context.application.createDocument();
    context.load(myNewDoc);

    const paragraph = context.document.body.insertParagraph("Hello World", Word.InsertLocation.end);

    await context.sync();

    var docBody = context.document.body;
    docBody.insertParagraph(
      "Office has several versions, including Office 2016, Office 365 Click-to-Run, and Office on the web.",
      "Start"
    );
    myNewDoc.open();
    var secondParagraph = context.document.body.paragraphs.getFirst().getNext();
    secondParagraph.insertTable(3, 3, "After", tableData);

    await context.sync();
  });
/*
 getBase64EncodedStringsOfImages(link: string): OfficeExtension.IPromise<IImage[]> {
        var start = performance.now();
        var imagesArray: IImage[] = [];
        return this._run(context => {
            var images = context.document.body.inlinePictures.load();
            return context.sync().then(() => {
                for (var i = 0; i < images.items.length; i++) {
                    var image = <IImage>{
                        imageFormat: images.items[i].imageFormat,
                        altTextTitle: images.items[i].altTextTitle,
                        altTextDescription: images.items[i].altTextDescription,
                        height: images.items[i].height,
                        width: images.items[i].width,
                        hyperlink: images.items[i].hyperlink,
                        base64ImageSrc: images.items[i].getBase64ImageSrc()

                    }
                    if (isEmpty(image.hyperlink)) {
                        var uniqueNumber = new Date().getTime();
                        var fileName = "Image" + uniqueNumber + "." + image.imageFormat;
                        image.hyperlink = "images/" + fileName;
                        image.altTextTitle = "images/" + fileName;
                        image.altTextDescription = "";
                        images.items[i].hyperlink = link + "/" + "images/" + fileName;
                        images.items[i].altTextTitle = "images/" + fileName;
                        images.items[i].altTextDescription = "";
                        imagesArray.push(image);
                    }
                }

                return context.sync().then(function () {
                  
                    return imagesArray;
                });
            });
        });
    }


     static isEmpty(obj: any): boolean {
        return _.isUndefined(obj) || _.isNull(obj) || _.isEmpty(obj);
    }
*/


}
