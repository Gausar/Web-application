"use strict";
function Cs142TemplateProcessor(template){
    this.template = template;
}

Cs142TemplateProcessor.fillIn = function(dictionary){
    let filledTemplate = this.template;
    Object.keys(dictionary).forEach(key => {
        const pattern = new RegExp("{{" + key + "}}", "g");
        filledTemplate = filledTemplate.replace(pattern, dictionary[key]);
    });
    filledTemplate = filledTemplate.replace(/\{\{[^]+\}\}/g, '');
    return filledTemplate;
};
