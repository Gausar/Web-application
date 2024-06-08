"use strict";

function Cs142TemplateProcessor(template){
    this.template = template;
}
Cs142TemplateProcessor.prototype.fillIn = function(dictionary){
    let filledTemplate = this.template;
    Object.keys(dictionary).forEach(key => {
        const pattern = new RegExp("{{" + key + "}}", "g");
        filledTemplate = filledTemplate.replace(pattern, dictionary[key]);
    });
    filledTemplate = filledTemplate.replace(/\{\{[^]+\}\}/g, '');
    return filledTemplate;
};

class TableTemplate{
    static fillIn(id, dictionary, columnName){
        var table = document.getElementById(id);
        var header = table.rows.item(0);
        var processor = new Cs142TemplateProcessor(header.innerHTML);
        var newHeader = processor.fillIn(dictionary);
        header.innerHTML = newHeader;

        var cols = [];
        if(columnName === undefined){
            cols = Array.from(Array(header.cells.length).keys());
        }
        else{
            for(let i = 0; i < header.cells.length; i++){
                if(header.cells[i].innerHTML === columnName){
                    cols.push(i);
                }
            }
        }

        for(let i = 1; i < table.rows.length; i++){
            for(let j = 0; j < cols.length; j++){
                var cell = table.rows[i].cells[cols[j]];
                var cellProcessor = new Cs142TemplateProcessor(cell.innerHTML);
                cell.innerHTML = cellProcessor.fillIn(dictionary);
            }
        }
        if(table.style.visibility === "hidden"){
            table.style.visibility = "visible";
        }
    }
}