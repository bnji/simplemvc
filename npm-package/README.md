[Simple.mvc.js](//hammerbenjamin.com/simplemvc)
=========

A lightweight MVC JavaScript library for UI binding.
=========

> The View (UI) should always be synchronised with the Model (data) and optionally the other way around. Many other [libraries](//todomvc.com) already solve this problem, but in many cases it's not enough to know JavaScript, HTML & CSS. Read more about the philosophy behind Simple.mvc below.



##Philosophy

**Ease of use**
Easy to get started (less than 5 minutes).

**One goal**
**Keep the View synchronised with the Model** and therefore should not handle routing, local storage, etc. by keeping things simple and not add unnecessary/extravagance functionality. 

**Light weight**
Keep the code as light weight as possible. The library is ~8KB minified!

**Standards**
Use existing HTML elements and attributes instead of a templating system.

**Cross-browser**
Use jQuery as the only dependency to ensure cross-browser compatability & rapid development. The tradeoff is, that  newer versions of jQuery only support modern browsers. Simple.mvc should work with IE7&IE8, but it definitely works with >IE8 and all modern web browsers (desktop/mobile). Note: jQuery 1.4.3 or newer is required.

**MVC design pattern**
There are many views on how to interpret [Model-View-Controller](//en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), but in this case it should be understood simply by asking the question:

> How can my HTML code interact with my JavaScript code and be kept in sync?

The goal is to bind the Model (data) with the View (UI). Hence, Simple.mvc can be considered as the **C** in MVC - the controller - which binds it together and keeps things in sync.

**Separation of Concerns**
Never mix HTML code with JavaScript code. 
`function getHtml() { return '<div>this is bad</div>'; }` 
[read more...](//en.wikipedia.org/wiki/Separation_of_concerns)

**Code quality**
High code quality using Test Driven Development with unit testing. A behavior-driven development framework called [Jasmine](//pivotal.github.com/jasmine) has been used for testing.
[Run Unit Tests](http://hammerbenjamin.com/simplemvc/simple.mvc.unit.test.html)

**Free & Open Source**
It's free & Open Source ([MIT licence](//opensource.org/licenses/MIT)).

**Chaining**
Run multiple methods (on the same element) within a single statement.

**Docs + Examples**
Well documented and has many real-world [examples](http://hammerbenjamin.com/simplemvc/examples). 
Todo App Demo: [Simple](http://hammerbenjamin.com/simplemvc/examples/todo/simple) - [Advanced](http://hammerbenjamin.com/simplemvc/examples/todo/advanced)
[API documentation](http://hammerbenjamin.com/simplemvc/docs)

#Installation

##Download (the old way)
Download [jQuery](//code.jquery.com/jquery-1.12.0.min.js).
Download [jQuery migrate](//code.jquery.com/jquery-migrate-1.2.1.min.js) (optional).
Download the [minified version of simple.mvc.js](//raw.github.com/bnji/simplemvc/master/simple.mvc.min.js) to be used in production.
or
Download [simple.mvc.js with comments](//raw.github.com/bnji/simplemvc/master/simple.mvc.js) to be used in development & debugging.

##The new way
Simple.mvc is available through Bower package manager and NPM.

### Install using Bower
Learn more about using and installing Bower at http://bower.io
To add Simplemvc to your application, you can run:

`bower install simple.mvc`

### Install using NPM
Learn more about using and installing NPM at https://nodejs.org/en/download
To add Simplemvc to your application, you can run:

`npm install simple.mvc`


##Installation
Reference the JavaScript file using a `<script>` tag somewhere on your HTML pages. For example,

`<script type='text/javascript' src='jquery-1.12.0.min.js'></script>`
`<script type='text/javascript' src='jquery-migrate-1.12.0.min.js'></script>`
`<script type='text/javascript' src='simple.mvc.js-1.0.1.min.js'></script>`

#Copyright and licence
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.