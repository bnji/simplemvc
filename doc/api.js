YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Controller",
        "List",
        "ModelView"
    ],
    "modules": [
        "JSON",
        "MVC"
    ],
    "allModules": [
        {
            "displayName": "JSON",
            "name": "JSON",
            "description": "An extension of the JSON object."
        },
        {
            "displayName": "MVC",
            "name": "MVC",
            "description": "Provides the core MVC classes: Controller & ModelView \n\n#1 Design Rule - Capitalization\n\nInternal methods (except the .toArray() method) have the first letter\ncapitalized. This is by design for two reasons:\n\n 1) JavaScript has many built in methods which already 'belong' to an object\n    so this is a good 'solution' which makes it possible to use methods such \n    as .Delete() (as .delete wouldn't be valid in JavaScript).\n\n2) To distinguish between the object's and JS built-in and 'custom' (passed\n  with the object data when a ModelView instance is created) methods. \n\n#2 Design Rule - Associative vs '.'-notation\n\nInternet Explorer (not all) don't like when an element/property in an \nobject literal or array is being accessed using dot notation. Even though\nit's generally encouraged (e.g. www.jshint.com) to use the dot notation, \nthis would very likely break when evaluated in IE! Therefore all \nelements/properties should be accessed associatively:\n obj = {foo : 'bar'}; \n obj['foo']; //(OK!)\n obj.foo; //(Breaks in IE (older versions)\n obj.someMethod(); //(OK! - also in IE!)"
        }
    ]
} };
});