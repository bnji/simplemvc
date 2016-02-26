Simple.mvc.js - Changelog
=========

**Version 1.0.9**
*Date: 26. feb. 2016*
* Wrapped jQuery modules with code to support the UMD pattern. As suggested on http://stackoverflow.com/questions/33353406/getting-referenceerror-jquery-is-not-defined-for-package-install-on-npm

**Version 1.0.8**
*Date: 26. feb. 2016*
* Updated links in readme.md

**Version 1.0.7**
*Date: 26. feb. 2016*
* Cleaned project structure
    * Moved tempX.html files into examples directory.
    * Changed CHANGELOG (this file) to CHANGELOG.MD (plain text > markdown)
    * Updated CHANGELOG. Every change after this release will be logged here. Version number is based on NPM publishes.
    * Added 3 new examples. Planning to move from JSFiddle to using 'local' examples.
* Updated Simple.mvc.js vs plain jQuery example.
* Updated unit tests to reflect breaking code changes made in Simple.mvc.js
* Updated and published NPM package (version 1.0.7)
* Added 1 new unit test:
    * "Setting 'id' to 'sometext' (a String) and not a Number should fail when property has class 'isNumber' in the view."
* Updated Simple.mvc.js
    * Before it was not possible to provide only one object containing Model, Settings and Methods. This is now possible using the following structure: `$("#test").ModelView({ model: {}, settings: {}, methods: {} });`.
    * Cloning elements improved. Now possible to only provide the id of the target element, as before it required 6 lines of code (now 1 line). See example `03_cloning_v1.html` and `03_cloning_v2.html` in examples directory.
    * Added `Reset()` method which resets the Model & View values to the original values on start.
    * Removed `ClearAll()` method.
    * Refactored `Clear(prop)` method to clear the value of a given property (prop) or if no parameter provided, it will clear all properties (in Model and View), which replaces the `ClearAll()` method.
    * Added `_ClearProp(prop)` (private) method which is called from within the `Clear(prop)` method.
    * Moved `ElementExists(selector)` more up in the $object as it's used with the cloning functionality.
    * Refactored `Set(prop)` method to only set values of a property when it exists or if its same value type.
    * Added `String.prototype.toUpperCaseFirst()`
    * Updated comments and other small code changes.