var htmlparser = require('htmlparser');

(function () {

    function parseHtml(html){

        var handler = new htmlparser.DefaultHandler(function (error, dom) {}, { verbose: false, ignoreWhitespace: true });
        var parser = new htmlparser.Parser(handler).parseComplete(html);

        return handler.dom
    }

    function buildObject(obj){

        var tempArray = [];

        for(var i in obj){
            if(obj[i].type != "text"){

                var tempObject = {};

                if(obj[i].attribs && obj[i].attribs.class){
                    tempObject.type = "class"

                    var classNames = obj[i].attribs.class.split(' ');

                    if(classNames.length > 1){
                        tempObject.children = []
                    }

                    for(var j in classNames){
                        if(j == 0){
                            tempObject.name = classNames[j];
                        } else {
                            tempObject.children[j-1] = {};
                            tempObject.children[j-1].type = "additional-class"
                            tempObject.children[j-1].name = classNames[j]
                        }

                    }

                } else if(obj[i].attribs && obj[i].attribs.id){
                    tempObject.type = "id"
                    tempObject.name = obj[i].attribs.id
                } else if(obj[i].type === "tag"){
                    tempObject.type = "tag"
                    tempObject.name = obj[i].name
                }

                if(obj[i].children && obj[i].children[0] && obj[i].children[0].type != "text"){
                    if (tempObject.children){
                        tempObject.children = tempObject.children.concat(buildObject(obj[i].children));
                    } else {
                        tempObject.children = buildObject(obj[i].children);
                    }
                }

                tempArray.push(tempObject);
            }

        }


        for(n in tempArray){
            if(n != 0 && tempArray[0].name == tempArray[n].name){

                if(tempArray[0].children){
                    tempArray[0].children = tempArray[0].children.concat(tempArray[n].children);
                } else {
                    tempArray[0].children = tempArray[n].children;
                }

                delete tempArray[n]
                // tempArray.splice(n, 1)
            }
        }

        return tempArray
    }

    function removeDuplicates(obj, print){

        var i = obj.length

        while(i--){

            var j = i;
            while(j--){

                if(obj[i] && obj[i].name && obj[j] && obj[j].name && obj[i].name === obj[j].name){

                    if(obj[i].children){

                        if(obj[j].children){

                            obj[j].children = obj[j].children.concat(obj[i].children)
                        } else {
                            obj[j].children = obj[i].children
                        }
                    }

                    delete obj[i]
                }
            }
        }

        var top = [];
        var rest = [];

        for(var n in obj){

            if(obj[n].children){
                obj[n].children = removeDuplicates(obj[n].children)
            }

            if(obj[n].type === "additional-class"){
                top.push(obj[n]);
            } else {
                rest.push(obj[n]);
            }
        }

        return top.concat(rest)
    }

    function print(obj, indent){
        if(!indent){
            var indent = '';
        }
        var tempArray = [];

        for(var i in obj){

            var modifier;
            if(obj[i].type === 'class'){
                modifier = '.'
            } else if(obj[i].type === 'id'){
                modifier = '#'
            } else if(obj[i].type === 'tag'){
                modifier = ''
            } else if(obj[i].type === 'additional-class'){
                modifier = '&.'
            }

            tempArray.push(indent + modifier + obj[i].name + '{\n');

            if(obj[i].children){

                var children = print(obj[i].children, indent + '\t');

                for(var j in children){
                    tempArray.push(children[j]);
                }
            }

            tempArray.push(indent + '}');
        }

        return tempArray
    }


    function parse(html){
        var html = parseHtml(html);
        var obj = buildObject(html);
        var clean = removeDuplicates(obj);
        var css = print(clean);

        return css.join('\n')
    }

    exports.buildObject = buildObject;
    exports.removeDuplicates = removeDuplicates;
    exports.print = print;
    exports.parse = parse;

})();
