[simple.mvc.js](http://hammerbenjamin.com/simplemvc-showcase)
=========

**A simple - yet solving a complex task while being lightweight - MVC / MVVM solution to your jQuery + HTML apps/websites.**

**There is a showcase with examples & API available: [http://hammerbenjamin.com/simplemvc-showcase](http://hammerbenjamin.com/simplemvc-showcase)**

#Getting started 

* [Download](https://github.com/bnji/simplemvc/zipball/master) the simple.mvc.js library.
* Include jQuery: [https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js](https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js) *Only if it's not included with your project already!
* Include the simple.mvc.js library in your project.
* Check out the examples: You can copy & paste them into your project and test them out or try the online demo below.


#The problem
The view should always be synchronized with the model and optionally the other way around. To solve this problem I've researched a little on how other libraries solve this problem and found Ember.js (42KB min.) & Angular.js(78KB min.) to be one of the people's favorites - mine included. Although these libraries solve the problem at hand - quite well - I still found myself left with a few questions:

* Do I need all this extra code which is more than 42KB?
* Can I achieve this with my current libraries (e.g. jQuery)?
* Do I really need to learn a new templating system (e.g. handlebars)?
* Is it possible to use the existing HTML attributes instead of creating new ones for gluing things together?
* How can I combine the best from both of these mentioned libraries, but only solving the task of keeping the view and model synchronized without too much extra functionality added?

#The solution
The solution to these questions could not be implemented (for cross-browser functionality) without jQuery, as there is a problem with event driven design using getters and setters in browsers like IE. Therefore the problem was solved using jQuery's .bind() and .trigger() methods bound to the object's properties.

**Philosophy behind**

* Keep the code as light weight as possible. (currently <4KB min.)
* Use existing HTML elements and attributes instead of a templating system.
* Cross-browser back to IE6!
* Always update the Model when the View changes.
* Optionally update the View, if reflectModelChangeInView is set to be true, when the Model is changed.
* Code quality and testing!
* Never add extravagance functionality!


#Copyright and licence

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.