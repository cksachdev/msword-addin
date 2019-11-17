import { Component } from "@angular/core";
const template = require("./app.component.html");
import * as FileSaver from 'file-saver';
@Component({
    selector: "app-home",
    template
})
export default class AppComponent {

    welcomeMessage = "Welcome";

    async run() {
        return Word.run(async context => {
            var htmlbody = context.document.body.getHtml();
            await context.sync();
            var hmtlstring = htmlbody.m_value;
            var passtring = hmtlstring.replace(/\\/g, "");
            const txtBlob = new Blob([passtring], { type: 'text/html;charset=utf-8' });
            FileSaver.saveAs(txtBlob, 'helloworld.html');
            await context.sync();
        });
    }
}