/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
import "zone.js"; // Required for Angular
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import AppModule from "./app/app.module";
/* global console, document, Office */

Office.initialize = () => {
  document.getElementById("sideload-msg").style.display = "none";
  document.getElementById("insert-table").onclick = insertTable;

  // Bootstrap the app
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(error => console.error(error));
};
function insertTable() {
    Word.run(function (context) {

        var secondParagraph = context.document.body.paragraphs.getFirst().getNext();

        var tableData = [
        ["Name", "ID", "Birth City"],
        ["Bob", "434", "Chicago"],
        ["Sue", "719", "Havana"],
    ];
secondParagraph.insertTable(3, 3, "After", tableData);

        return context.sync();
    })
    .catch(function (error) {
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    });
}
