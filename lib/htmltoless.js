var htmlparser = require('htmlparser');

(function () {

    function htmlToObj(html){

        var handler = new htmlparser.DefaultHandler(function (error, dom) {}, { verbose: false, ignoreWhitespace: true });
        var parser = new htmlparser.Parser(handler).parseComplete(html);

        return handler.dom

    }

    function removeDuplicates(obj){
        for(var i in obj){

            var previousObj;
            if(obj[i-1]){
                previousObj = obj[i-1]
            } else if (obj[i-2]){
                previousObj = obj[i-2]
            } else if (obj[i-3]){
                previousObj = obj[i-3]
            }

            // If has class and previous node exists
            if(obj[i].name && obj[i].attribs && obj[i].attribs.class && previousObj && previousObj.attribs && previousObj.attribs.class){

                // multiple classes split space
                var className = obj[i].attribs.class.split(' ');
                var previousClass = previousObj.attribs.class.split(' ')

                // If first class matches
                if(className[0] == previousClass[0]){

                    // if second class is different and it isnt anywhere else in class array
                    if(className[1] != previousClass[1] && previousClass.indexOf(className[1]) == -1){
                        // doesnt push unknowns
                        if(!!className[1]){

                            // add class to previous object
                            previousObj.attribs.class = previousObj.attribs.class + ' ' + className[1]
                        }

                    }

                    // delete it. TODO: remove null
                    // obj.splice(i, 1);
                    delete obj[i]
                }

            }

            // loop through children if it has any
            if(obj[i] && obj[i].children){
                removeDuplicates(obj[i].children);
            }


        }
    }

    function objToArray(obj, indent, output, skipClasses){
        for(var i in obj){

            // if is a tag, not text
            if(obj[i].name){

                // if is has a class
                if(obj[i].attribs && (obj[i].attribs.class || obj[i].attribs.id)){

                    if(obj[i].attribs.id){

                        output.push(indent + '#' + obj[i].attribs.id + '{\n');

                    } else {

                        // multiple classes split space
                        var className = obj[i].attribs.class.split(' ');

                        // loop through classes
                        for(j in className){

                            // look for class names to skip
                            if(skipClasses.indexOf(className[j]) == -1){

                                // if first class use .
                                if(j == 0){
                                    output.push(indent + '.' + className[j] + '{\n');

                                // else nested use &.
                                } else {
                                    output.push(indent + '    &.' + className[j] + '{\n');
                                    output.push(indent + '    }')
                                }
                            }
                        }

                    }
                // else if is id #todo

                // else just a tag
                } else {
                    output.push(indent + obj[i].name + '{\n');
                }

                // loop through children if it has any
                if(obj[i].children){
                    objToArray(obj[i].children, indent + '    ', output, skipClasses);
                }

                // closing tag
                output.push(indent + '}');
            }
        }
    }

    function objToCss(obj){
        var skipClasses = ['ripple', 'clearfix'];
        var output = [];
        objToArray(obj, '', output, skipClasses)

        return output
    }

    function parse(html, options){

        var obj = htmlToObj(html);

        removeDuplicates(obj);

        var output = objToCss(obj);

        return output.join('\n')
    }

    exports.htmlToObj = htmlToObj;
    exports.objToCss = objToCss;
    exports.removeDuplicates = removeDuplicates;
    exports.parse = parse;

})();
