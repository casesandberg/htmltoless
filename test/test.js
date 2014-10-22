var should = require('should');
var htmltoless = require('../lib/htmltoless');

should.warn = false;

describe('htmlToObj', function(){

    it('should work for simple tags', function(){
        htmltoless.htmlToObj('<p>')[0].should.have.property('name', 'p');
    });

});

describe('removeDuplicates', function(){

    it('should not change obj if it does not have duplicates', function(){

        var obj = htmltoless.htmlToObj('<div class="one"><span>One</span></div><div class="two"><span>Two</span></div>');
        var oldObj = htmltoless.htmlToObj('<div class="one"><span>One</span></div><div class="two"><span>Two</span></div>');

        htmltoless.removeDuplicates(obj);

        obj.should.eql(oldObj)
    });


    it('should change obj if it has duplicates', function(){

        var obj = htmltoless.htmlToObj('<div class="one"><span>One</span></div><div class="one"><span>One</span></div>');
        var target = htmltoless.htmlToObj('<div class="one"><span>One</span></div>');

        htmltoless.removeDuplicates(obj);

        obj.should.eql(target)
    });

    it('should add classes from duplicates', function(){

        var obj = htmltoless.htmlToObj('<ul><li class="row active-row"></li><li class="row inactive-row"></li><li class="row active-row"></li></ul>');

        var target = [{
            type: 'tag',
            name: 'ul',
            children: [ {
                "attribs": {
                    "class": "row active-row inactive-row"
                },
                "name": "li",
                "type": "tag"
            }]
        }];

        htmltoless.removeDuplicates(obj);

        obj.should.eql(target)
    });

    it('should add classes from duplicates that are 3n deep', function(){

        var obj = htmltoless.htmlToObj('<ul><li class="row active-row"></li><li class="row inactive-row"></li><li class="row active-row"></li><li class="row three-row"></li></ul>');

        var target = [{
            type: 'tag',
            name: 'ul',
            children: [ {
                "attribs": {
                    "class": "row active-row inactive-row three-row"
                },
                "name": "li",
                "type": "tag"
            }]
        }];

        htmltoless.removeDuplicates(obj);

        obj.should.eql(target)
    });

});

describe('objToCss', function(){

    // class and id on same element

    it('Should output classes, ID, and elements', function(){

        var obj = [{
            type: 'tag',
            name: 'ul',
            children: [ {
                "attribs": {
                    "class": "row active-row inactive-row three-row"
                },
                "name": "li",
                "type": "tag"
            },
            {
                "attribs": {
                    "id": "row"
                },
                "name": "li",
                "type": "tag"
            },
            {
                "name": "li",
                "type": "tag"
            }]
        }];

        var target = [
        'ul{\n',
        '    .row{\n',
        '        &.active-row{\n',
        '        }',
        '        &.inactive-row{\n',
        '        }',
        '        &.three-row{\n',
        '        }',
        '    }',
        '    #row{\n',
        '    }',
        '    li{\n',
        '    }',
        '}'];

        htmltoless.objToCss(obj).should.eql(target);
    });

    it('Should nest at least 6 levels', function(){

        var obj = [{
            type: 'tag',
            name: 'ul',
            children: [ {
                "name": "li",
                "type": "tag",
                children: [ {
                    "name": "div",
                    "type": "tag",
                    children: [ {
                        "name": "div",
                        "type": "tag",
                        children: [ {
                            "name": "div",
                            "type": "tag",
                            children: [ {
                                "name": "div",
                                "type": "tag",
                                children: [ {
                                    "name": "div",
                                    "type": "tag"
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        }];

        var target = [
        'ul{\n',
        '    li{\n',
        '        div{\n',
        '            div{\n',
        '                div{\n',
        '                    div{\n',
        '                        div{\n',
        '                        }',
        '                    }',
        '                }',
        '            }',
        '        }',
        '    }',
        '}'];

        htmltoless.objToCss(obj).should.eql(target);
    });

});


describe('parse', function(){

    it('should parse end to end', function(){

        var html = '<ul><li class="row active-row"></li><li class="row"></li><li class="row inactive-row"></li><li class="row"></li><li class="row three-row"></li><li id="row"></li><li></li></ul>';

        var target =
        'ul{\n\n' +
        '    .row{\n\n' +
        '        &.active-row{\n\n' +
        '        }\n' +
        '        &.inactive-row{\n\n' +
        '        }\n' +
        '        &.three-row{\n\n' +
        '        }\n' +
        '    }\n' +
        '    #row{\n\n' +
        '    }\n' +
        '    li{\n\n' +
        '    }\n' +
        '}';

        htmltoless.parse(html).should.eql(target);
    });

});

// describe('When parsing HTML', function(){
//     var html;
//
//     before(function(){
//         html = htmltoless.parse('<p>');
//     });
//
//     it('should return html', function(){
//         html.should.equal('<p>');
//     });
// });


//[ { type: 'tag', name: 'p' } ]
