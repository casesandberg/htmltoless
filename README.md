#HTML to LESS
Converts html into structured less.

###Installing

    npm install htmltoless

###Useage

```javascript
var htmltoless = require("htmltoless");

var html =
'<li class="person">' +
    '<div class="person-avatar">' +
        '<div class="avatar" style="background-image: url("http://www.conferenceiq.com/media/avatars/963/avatar-original-bpfull.jpg");"></div>' +
    '</div>' +
    '<div class="person-name">' +
        '<span>Richard Branson</span>' +
    '</div>' +
'</li>';

var less = htmltoless.parse(html);

console.log(less);
```

###Output

```less
.person{

	.person-avatar{

		.avatar{

		}
	}
	.person-name{

		span{

		}
	}
}
```

###Run Tests
    mocha
