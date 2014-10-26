var should = require('should');
var htmltoless = require('../lib/htmltoless');

describe('Build Object', function(){

    it('Should Differentiate Class, ID and Tag', function(){

        var dirty = [{
            "attribs": {
                "class": "row"
            },
            "name": "div",
            "type": "tag"
        }, {
            "attribs": {
                "id": "row-two"
            },
            "name": "div",
            "type": "tag"
        }, {
            "name": "div",
            "type": "tag"
        }];

        var clean = [{
            type: "class",
            name: "row"
        }, {
            type: "id",
            name: "row-two"
        }, {
            type: "tag",
            name: "div"
        }];

        htmltoless.buildObject(dirty).should.eql(clean);
    });

    it('Should Nest 5n Deep', function(){

        var dirty = [{
            "attribs": {
                "class": "box"
            },
            type: "tag",
            name: "div",
            children: [{
                "attribs": {
                    "class": "box"
                },
                type: "tag",
                name: "div",
                children: [{
                    "attribs": {
                        "class": "box"
                    },
                    type: "tag",
                    name: "div",
                    children: [{
                        "attribs": {
                            "class": "box"
                        },
                        type: "tag",
                        name: "div",
                        children: [{
                            "attribs": {
                                "class": "box"
                            },
                            type: "tag",
                            name: "div",
                        }]
                    }]
                }]
            }]
        }];

        var clean = [{
            type: "class",
            name: "box",
            children: [{
                type: "class",
                name: "box",
                children: [{
                    type: "class",
                    name: "box",
                    children: [{
                        type: "class",
                        name: "box",
                        children: [{
                            type: "class",
                            name: "box",
                        }]
                    }]
                }]
            }]
        }];

        htmltoless.buildObject(dirty).should.eql(clean);
    });

    it('Should Skip Text', function(){

        var dirty = [{
            type: "tag",
            name: "ul",
            children: [{
                "attribs": {
                    "class": "row"
                },
                "name": "li",
                "type": "tag",
                children: [{
                    data: "List Element",
                    type: "text"
                }]
            }, {
                "name": "li",
                "type": "tag",
                children: [{
                    name: "h1",
                    type: "tag",
                    children: [{
                        data: "Element Header",
                        type: "text"
                    }]
                }]
            }]
        }];

        var clean = [{
            type: "tag",
            name: "ul",
            children: [{
                type: "class",
                name: "row"
            }, {
                type: "tag",
                name: "li",
                children: [{
                    type: "tag",
                    name: "h1"
                }]
            }]
        }];

        htmltoless.buildObject(dirty).should.eql(clean);
    });

    it('Should Create Children For Multiple Classes', function(){

        var dirty = [{
            "attribs": {
                "class": "box square-box active-box"
            },
            type: "tag",
            name: "div",
            children: [{
                "attribs": {
                    "class": "box-inside"
                },
                type: "tag",
                name: "div"
            }]
        }];

        var clean = [{
            type: "class",
            name: "box",
            children: [{
                type: "additional-class",
                name: "square-box",
            }, {
                type: "additional-class",
                name: "active-box",
            }, {
                type: "class",
                name: "box-inside"
            }]
        }];

        htmltoless.buildObject(dirty).should.eql(clean);
    });

});

describe('Remove Duplicate', function(){

    it('Should Combine Duplicates', function(){

        var dirty = [{
            type: "tag",
            name: "ul",
            children: [{
                type: "class",
                name: "user"
            }, {
                type: "class",
                name: "user",
                children: [{
                    type: "additional-class",
                    name: "active-user"
                }]
            }, {
                type: "class",
                name: "user",
                children: [{
                    type: "additional-class",
                    name: "inactive-user"
                }]
            }]
        }];

        var clean = [{
            type: "tag",
            name: "ul",
            children: [{
                type: "class",
                name: "user",
                children: [{
                    type: "additional-class",
                    name: "active-user",
                }, {
                    type: "additional-class",
                    name: "inactive-user",
                }]
            }]
        }];

        htmltoless.removeDuplicates(dirty).should.eql(clean);
    });

    it('Should Combine Complex Children', function(){

        var dirty = [{
            type: "class",
            name: "box"
        }, {
            type: "class",
            name: "box",
            children: [{
                type: "class",
                name: "box-body"
            }, {
                type: "class",
                name: "box-body",
                children: [{
                    type: "class",
                    name: "body-head"
                }, {
                    type: "class",
                    name: "body-head"
                }]
            }]
        }];

        var clean = [{
            type: "class",
            name: "box",
            children: [{
                type: "class",
                name: "box-body",
                children: [{
                    type: "class",
                    name: "body-head"
                }]
            }]
        }];

        htmltoless.removeDuplicates(dirty).should.eql(clean);
    });

    it('Should Combine Children In Order With Varying Children', function(){

        var dirty = [{
            type: "class",
            name: "rock",
            children: [{
                type: "additional-class",
                name: "active-rock"
            }, {
                type: "additional-class",
                name: "rock-1"
            }, {
                type: "class",
                name: "rock-icon"
            }, {
                type: "class",
                name: "rock-outer",
                children: [{
                    type: "class",
                    name: "rock-inner",
                    children: [{
                        type: "class",
                        name: "inner-rock",
                        children: [, {
                            type: "class",
                            name: "big-circle"
                        }, {
                            type: "class",
                            name: "circle-1"
                        }, {
                            type: "class",
                            name: "circle-2"
                        }, {
                            type: "class",
                            name: "circle-3"
                        }]
                    }]
                }]
            }]
        }, {
            type: "class",
            name: "rock",
            children: [{
                type: "additional-class",
                name: "rock-2"
            }, {
                type: "class",
                name: "rock-icon"
            }, {
                type: "class",
                name: "rock-outer",
                children: [{
                    type: "class",
                    name: "rock-inner",
                    children: [{
                        type: "class",
                        name: "inner-rock",
                        children: [, {
                            type: "class",
                            name: "big-circle"
                        }, {
                            type: "class",
                            name: "circle-1"
                        }, {
                            type: "class",
                            name: "circle-2"
                        }]
                    }]
                }]
            }]
        }];

        var clean = [{
            type: "class",
            name: "rock",
            children: [{
                type: "additional-class",
                name: "active-rock"
            }, {
                type: "additional-class",
                name: "rock-1"
            }, {
                type: "additional-class",
                name: "rock-2"
            }, {
                type: "class",
                name: "rock-icon"
            }, {
                type: "class",
                name: "rock-outer",
                children: [{
                    type: "class",
                    name: "rock-inner",
                    children: [{
                        type: "class",
                        name: "inner-rock",
                        children: [{
                            type: "class",
                            name: "big-circle"
                        }, {
                            type: "class",
                            name: "circle-1"
                        }, {
                            type: "class",
                            name: "circle-2"
                        }, {
                            type: "class",
                            name: "circle-3"
                        }]
                    }]
                }]
            }]
        }];

        htmltoless.removeDuplicates(dirty).should.eql(clean);

    });

});

describe('Print', function(){

    it('Should Differentiate Class, ID, Tag and Additional Classes', function(){

        var dirty = [{
            type: "class",
            name: "row"
        }, {
            type: "id",
            name: "row-two"
        }, {
            type: "tag",
            name: "div"
        }, {
            type: "additional-class",
            name: "square-box",
        }];

        var clean = [
        '.row{\n',
        '}',
        '#row-two{\n',
        '}',
        'div{\n',
        '}',
        '&.square-box{\n',
        '}'];

        htmltoless.print(dirty).should.eql(clean);
    });

    it('Should Nest Classes', function(){

        var dirty = clean = [{
            type: "class",
            name: "box",
            children: [{
                type: "additional-class",
                name: "square-box",
            }, {
                type: "additional-class",
                name: "active-box",
            }, {
                type: "class",
                name: "box-inside"
            }]
        }];

        var clean = [
        '.box{\n',
        '\t&.square-box{\n',
        '\t}',
        '\t&.active-box{\n',
        '\t}',
        '\t.box-inside{\n',
        '\t}',
        '}'];

        htmltoless.print(dirty).should.eql(clean);
    });

});

describe('End To End', function(){

    it('Should Parse Basic End To End', function(){

        var dirty = "<div class='box'></div><div id='box-2'></div><div></div>";

        var clean =
        '.box{\n' + '\n' +
        '}' + '\n' +
        '#box-2{\n' + '\n' +
        '}' + '\n' +
        'div{\n' + '\n' +
        '}';

        htmltoless.parse(dirty).should.eql(clean);
    });

    it('Should Parse Complex End To End', function(){

        var dirty =
        '<div class="content-miners">' +
            '<div class="miners-feature">' +
                '<div class="feature-rocks">' +
					'<ul class="rocks-wrap">' +
						'<li class="rock active-rock rock-1">' +
							'<div class="rock-icon"></div>' +
							'<div class="rock-outer">' +
								'<div class="rock-inner">' +
								    '<div class="inner-rock">' +
										'<div class="big-circle"></div>' +
										'<div class="circle-1"></div>' +
										'<div class="circle-2"></div>' +
										'<div class="circle-3"></div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</li>' +
						'<li class="rock rock-2">' +
							'<div class="rock-icon"></div>' +
							'<div class="rock-outer">' +
								'<div class="rock-inner">' +
									'<div class="inner-rock">' +
										'<div class="big-circle"></div>' +
										'<div class="circle-1"></div>' +
										'<div class="circle-2"></div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</li>' +
					'</ul>' +
                '</div>' +
                '<ul class="feature-stats">' +
                    '<li class="stat payout-stat">' +
                        '<div class="stat-number">2 Days</div>' +
                        '<div class="stat-label">until payout</div>' +
                    '</li>' +
                    '<li class="stat rocks-stat">' +
                        '<div class="stat-number">3,425</div>' +
                        '<div class="stat-label">rocks mined</div>' +
                    '</li>' +
                '</ul>' +
            '</div>' +
            '<ul class="miners-list">' +
                '<li class="miner ripple">' +
                    '<div class="miner-icon">' +
                        '<img class="icon" src="images/miners-ufo.svg">' +
                    '</div>' +
                    '<div class="miner-info">' +
                        '<span class="info-name">Miner 31c5</span>' +
                        '<span class="info-rate">55 rocks / hour</span>' +
                    '</div>' +
                    '<div class="miner-clickthrough">' +
                        '<div class="clickthrough-icon"></div>' +
                    '</div>' +
                '</li>' +
                '<li class="miner add-miner ripple" ng-click="go("/connect-miner")">' +
                    '<div class="miner-icon">' +
                        '<img class="icon plus-icon" src="images/miners-add.svg">' +
                    '</div>' +
                    '<div class="miner-info">' +
                        '<span class="info-name">Add Another Miner</span>' +
                        '<span class="info-rate">Cloud Mining</span>' +
                    '</div>' +
                    '<div class="miner-clickthrough">' +
                        '<div class="clickthrough-icon"></div>' +
                    '</div>' +
                '</li>' +
            '</ul>' +
        '</div>';

        var clean =
        '.content-miners{\n' + '\n' +
            '\t.miners-feature{\n' + '\n' +
                '\t\t.feature-rocks{\n' + '\n' +
                    '\t\t\t.rocks-wrap{\n' + '\n' +
                        '\t\t\t\t.rock{\n' + '\n' +
                            '\t\t\t\t\t&.active-rock{\n' + '\n' +
                            '\t\t\t\t\t}' + '\n' +
                            '\t\t\t\t\t&.rock-1{\n' + '\n' +
                            '\t\t\t\t\t}' + '\n' +
                            '\t\t\t\t\t&.rock-2{\n' + '\n' +
                            '\t\t\t\t\t}' + '\n' +
                            '\t\t\t\t\t.rock-icon{\n' + '\n' +
                            '\t\t\t\t\t}' + '\n' +
                            '\t\t\t\t\t.rock-outer{\n' + '\n' +
                                '\t\t\t\t\t\t.rock-inner{\n' + '\n' +
                                    '\t\t\t\t\t\t\t.inner-rock{\n' + '\n' +
                                        '\t\t\t\t\t\t\t\t.big-circle{\n' + '\n' +
                                        '\t\t\t\t\t\t\t\t}' + '\n' +
                                        '\t\t\t\t\t\t\t\t.circle-1{\n' + '\n' +
                                        '\t\t\t\t\t\t\t\t}' + '\n' +
                                        '\t\t\t\t\t\t\t\t.circle-2{\n' + '\n' +
                                        '\t\t\t\t\t\t\t\t}' + '\n' +
                                        '\t\t\t\t\t\t\t\t.circle-3{\n' + '\n' +
                                        '\t\t\t\t\t\t\t\t}' + '\n' +
                                    '\t\t\t\t\t\t\t}' + '\n' +
                                '\t\t\t\t\t\t}' + '\n' +
                            '\t\t\t\t\t}' + '\n' +
                        '\t\t\t\t}' + '\n' +
                    '\t\t\t}' + '\n' +
                '\t\t}' + '\n' +
                '\t\t.feature-stats{\n' + '\n' +
                    '\t\t\t.stat{\n' + '\n' +
                        '\t\t\t\t&.payout-stat{\n' + '\n' +
                        '\t\t\t\t}' + '\n' +
                        '\t\t\t\t&.rocks-stat{\n' + '\n' +
                        '\t\t\t\t}' + '\n' +
                        '\t\t\t\t.stat-number{\n' + '\n' +
                        '\t\t\t\t}' + '\n' +
                        '\t\t\t\t.stat-label{\n' + '\n' +
                        '\t\t\t\t}' + '\n' +
                    '\t\t\t}' + '\n' +
                '\t\t}' + '\n' +
            '\t}' + '\n' +
            '\t.miners-list{\n' + '\n' +
                '\t\t.miner{\n' + '\n' +
                    '\t\t\t&.ripple{\n' + '\n' +
                    '\t\t\t}' + '\n' +
                    '\t\t\t&.add-miner{\n' + '\n' +
                    '\t\t\t}' + '\n' +
                    '\t\t\t.miner-icon{\n' + '\n' +
                        '\t\t\t\t.icon{\n' + '\n' +
                            '\t\t\t\t\t&.plus-icon{\n' + '\n' +
                            '\t\t\t\t\t}' + '\n' +
                        '\t\t\t\t}' + '\n' +
                    '\t\t\t}' + '\n' +
                    '\t\t\t.miner-info{\n' + '\n' +
                        '\t\t\t\t.info-name{\n' + '\n' +
                        '\t\t\t\t}' + '\n' +
                        '\t\t\t\t.info-rate{\n' + '\n' +
                        '\t\t\t\t}' + '\n' +
                    '\t\t\t}' + '\n' +
                    '\t\t\t.miner-clickthrough{\n' + '\n' +
                        '\t\t\t\t.clickthrough-icon{\n' + '\n' +
                        '\t\t\t\t}' + '\n' +
                    '\t\t\t}' + '\n' +
                '\t\t}' + '\n' +
            '\t}' + '\n' +
        '}';

        // console.log(htmltoless.parse(dirty));
        //
        // console.log(clean);

        htmltoless.parse(dirty).should.eql(clean);
    });

});
