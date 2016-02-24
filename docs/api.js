YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Controller",
        "List",
        "ModelView",
        "getSetHtml"
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
            "description": "Design rules:\n1) Capitalization\n   Internal methods (except .toArray()) should have the\n   first letter capitalized, so it's possible to\n   distinguish between internal JavaScript methods and\n   Simple.mvc ModelView object. methods.\n\n2) Bracket vs Dot notation\n   Older versions of IE don't accept the use of\n   accessing a an object's property using dot-\n   notation (obj.propertyName). However,\n   accessing the property using bracket notation\n   will work (obj['propertyName'])."
        }
    ],
    "elements": []
} };
});