// ==========================================================================
// Project:   Simple JavaScript MVC / MVVM
// Copyright: ©2012 Benjamin Hammer (hammerbenjamin@gmail.com)
// License:   Licensed under MIT license (see LICENCE.MD)
// To minify: http://localhost/minify/min/?f=simplemvc/simple.mvc.js
// ==========================================================================
/**
 * Provides the core MVC classes: Controller & ModelView 
 * 
 * #1 Design Rule - Capitalization
 * 
 * Internal methods (except the .toArray() method) have the first letter
 * capitalized. This is by design for two reasons:
 * 
 *  1) JavaScript has many built in methods which already 'belong' to an object
 *     so this is a good 'solution' which makes it possible to use methods such 
 *     as .Delete() (as .delete wouldn't be valid in JavaScript).
 * 
 * 2) To distinguish between the object's and JS built-in and 'custom' (passed
 *   with the object data when a ModelView instance is created) methods. 
 * 
 * #2 Design Rule - Associative vs '.'-notation
 * 
 * Internet Explorer (not all) don't like when an element/property in an 
 * object literal or array is being accessed using dot notation. Even though
 * it's generally encouraged (e.g. www.jshint.com) to use the dot notation, 
 * this would very likely break when evaluated in IE! Therefore all 
 * elements/properties should be accessed associatively:
 *  obj = {foo : 'bar'}; 
 *  obj['foo']; //(OK!)
 *  obj.foo; //(Breaks in IE (older versions)
 *  obj.someMethod(); //(OK! - also in IE!)
 * 
 * 
 * 
 * 
 * @module MVC
 * @main MVC
 */
var MVC = {
  /**
   * KeyCheck
   * 
   * A human way to check which key was used.
   * This is supposed to simulate a static method known from other languages such
   * as Java.
   * 
   * @method KeyCheck
   * @param {Object} e Event
   * @param {String} n Name of the key to check against (e.g. 'enter', 'escape')
   */
  KeyCheck : function(e, n) {
    if(e.keyCode === 13 && (n === 'enter' || n === 'return')) {
      return true;
    } else if(e.keyCode === 27 && n === 'escape') {
      return true;
    }
  },
  /**
   * List
   * 
   * A more human way of handling array's in JavaScript. it extends the array 
   * (currently) with two extra methods which makes it more easy and semantic
   * when adding and removing elements using .Add() and .Remove() methods 
   * respectively.
   * 
   * @class List
   * @param {Object} An array (is optional)
   */
  List : function(array) {
    //If the optional paramater 'array' hasn't been specified, then create an
    //empty Array.
    if(array === undefined || array === null) {
      array = [];
    }
    /**
     * Add
     * 
     * Add a new element - It's more semantic to use .Add() instead of .push().
     * 
     * @method Add
     * @param {Object} An element.
     * @return {Array} The array.
     */
    array.Add = function(element) {
      array.push(element);
      return array;
    };
    /**
     * Remove
     * 
     * Remove an element (if found) from the array.
     * 
     * @method Remove
     * @param {Object} An element.
     */
    array.Remove = function(element) {
      //More about deleting elements from an array in JavaScript:
      //http://stackoverflow.com/questions/500606/javascript-array-delete-elements
      //indexOf breaks in IE < 9!
      //var i = array.indexOf(element);
      //Solution:
      var i = $.inArray(element, array);
      if(i !== -1) {
        array.splice(i, 1);
        return true;
      }
      return false;
    };
    /**
     * Find
     * 
     * Find elements in the array and return those elemens in a new array.
     * 
     * @method Find
     * @param {Object} An element.
     * @return {Array} A new Array containing the found elements.
     * 
     */
    array.Find = function(element) {
      var foundItems = [];
      var index = array.indexOf(element);
      while (index !== -1)
      {
        foundItems.push(index);
        index = array.indexOf(element, ++index);
      }
    };
    return array;
  },
  /**
   * Controller which handles the logic, such as saving, updating or deleting
   * the object.
   * 
   * For the time being the Controller class doesn't do much more than returning
   * the same data as entered (JSON) object literal. Still this is by design, as
   * there is a possibility for the 'controller' to do more than this 'stuff' 
   * (handling more than returning data) in the future.
   *  
   * 
   * @class Controller
   * @constructor
   */
  Controller : function(data) {
    return data;
  },
  /**
   * ModelView creates a new object with data and settings. The data and 
   * settings are (JSON) object literals and merged and returned after all the
   * internal setup is done.
   * The ModelView contains all the information about the object, which keeps
   * the View synchronized with the Model and vice versa.
   * 
   * @class ModelView
   * @constructor
   */
  ModelView : function(viewId, $object, $settings) {
    //console.log("ModelView Created...");
    
    //Make sure that the object data always exists. Only require 'viewId'
    if($object === null || $object === undefined) {
      $object = {};
    } 
    
    //Make sure that the settings always exist and with certain properties.
    if($settings === null || $settings === undefined) {
      $settings = {};
    }
    
    var clone = $settings['clone'];
    if(clone !== undefined) {
      //Set the clone template to be the view id
      clone['template'] = viewId;
      //Update the view id with the new clone id
      viewId = clone['id'];
      var viewIdNoHash = viewId.substring(1, viewId.length);
      //Clone the source and update the viewId
      var element = $($(clone['template']).clone(clone['withDataAndEvents']))
                      .attr('id', viewIdNoHash);
      
      //Update the datasrc with the new view id
      $(element)
        //.find(viewId + ' li[datasrc=""]')
        .find('[datasrc=""]')
        .attr('datasrc', viewId);
      //If the template originally was hidden using 'display: none;' - make it visible to the user
      //element.show();
      //Append the copy to the target
      clone['append'](element);
    }
    
    if($settings['viewId'] === undefined) {
      $.extend($settings, {viewId : viewId});
    }
    if($settings['reflectModelChangeInView'] === undefined) {
      $.extend($settings, {reflectModelChangeInView : true});
    }
    if($settings['eventUsed'] === undefined) {
      $.extend($settings, {eventUsed : ''});
    }
  
    //Attach events to the save, update, delete (more?) buttons/submit.
    $(viewId + ' button,' + viewId + ' a,' + viewId + ' submit,' + viewId + ' i')
      //.find('button,a,submit,i')
      .each(function(i, e) {
        $(this)
        //.attr('id', e.id+'_'+viewId)//NoHash)
        .click(function(e) {
          //$object.RunCtr($id, par);
          //$object.Save();
          //console.log(e.target.name);
          $object.RunCtr(e.target.name);
        });
        //console.log(i + " " + e.id);
      });
    
    //Start: Methods
    
    /**
     * Call the .Save() method whenever you want to save the object.
     * Notice: This is intended behaviour, but the implementation of the
     * method is up to the individual how and what is done when this method
     * is called/executed.
     * 
     * @method Save
     * @param {Object} par Provide extra parameters if needed. 
     * @return {Object} The object (itself)
     */
    $object.Save = function(par) {
      $object.RunCtr('Save', par);
      return $object;
    };
    /**
     * Call the .Update() method whenever you want to update the object.
     * Notice: This is intended behaviour, but the implementation of the
     * method is up to the individual how and what is done when this method
     * is called/executed.
     * 
     * @method Update
     * @param {Object} par Provide extra parameters if needed. 
     * @return {Object} The object (itself)
     */
    $object.Update = function(par) {
      $object.RunCtr('Update', par);
      return $object;
    };
    /**
     * Call the .Delete() method whenever you want to delete the object.
     * Notice: This is intended behaviour, but the implementation of the
     * method is up to the individual how and what is done when this method
     * is called/executed.
     * 
     * @method Delete
     * @param {Object} par Provide extra parameters if needed.
     * @return {Object} The object (itself)
     */
    $object.Delete = function(par) {
      $object.RunCtr('Delete', par);
      return $object;
    };
    
    /**
     * Clear
     * 
     * Clears a property's value in the Model and the View.
     * 
     * 
     * @method Clear
     * @return {Object} The object (itself)
     */
    $object.Clear = function(prop) {
      $object.Set(prop, '');
      return $object;
    };
    
    /**
     * Clear All
     * 
     * Clears all the data in the Model and the View.
     * 
     * @method ClearAll
     * @return {Object} The object (itself)
     */
    $object.ClearAll = function() {
      //implement it
      return $object;
    };
    
    /**
     * AddGetSet
     * 
     * Add getter and setter methods for a property
     * 
     * Getters and Setters in JavaScript/JScript (ECMAScript) are not an option
     * as it is hard to make it work cross-browser/platform!
     * There is a solution here, but only down to IE9:
     * Source: http://javascriptweblog.wordpress.com/2010/11/15/extending-objects-with-javascript-getters/
     * 
     * If changes in the model properties should be reflected in the view
     * then setter and getter methods will be attached using jQuery.
     * 
     * Note: Will only be used(exec.) if 'reflectModelChangeInView' is TRUE.
     * 
     * Works in IE 7+: http://jsfiddle.net/cTJZN/
     * 
     * @method AddGetSet
     * @param {String} prop The object's property name
     * @param {Function} onUpdate callBack function will execute, whenever 
     * the get/set event handlers bound with .bind() method are triggered.
     * @return {Object} The object (itself)
     */
    $object.AddGetSet = function(prop) {//, onUpdate) {
      //console.log("AddGetSet");
      //var prop = Common.FstChrUp(prop);
      
      $($object)
        .bind('get'+prop, function(event, ret) {
          ret['value'] = $object[prop];
        })
        .bind('set'+prop, function (event, newVal) {
          //Replace the old value with the new value in the model
          var oldVal = $object[prop];
          //Only update values if they're changed
          if(oldVal !== newVal) {
            $object[prop] = newVal;
            
            
            //alert(n + ": " + ov + "=>" + nv);
            //Update the view accordingly
            //MVC.SetViewFromModel(viewId, $object); //$(viewId).getSetHtml($object);
            $object.SetViewFromModel();
            
            //Make sure that the input will have the change event triggered,
            //so that the views bound to this element will also be updated.
            //This is important in case the model is changed using setTimeout()
            //which will update the model, then this change must simulate
            //a user setting the value of the input. 
            $object.triggerEvent(prop, 'change');//.triggerEvent(prop, 'keyup');
            //alert("OK");
            //onUpdate(prop, oldVal, newVal);
          }
        });
        return $object;
    };
    
    /**
     * RemoveGetSet
     * 
     * Remove getter and setter methods for a property
     * 
     * @method RemoveGetSet
     * @param {String} prop The object's property name 
     * @return {Object} The object (itself)
     */
    $object.RemoveGetSet = function(prop) {
      $($object)
        .unbind('get'+prop)
        .unbind('set'+prop);
        
      return $object;
    };
    
    /**
     * Trigger Event
     * 
     * Trigger an event on an input element inside the view
     * 
     * @method triggerEvent
     * @param {String} prop Property name
     * @param {String} evt Event type/name (e.g. 'keyup')
     * @return {Object} The object (itself)
     */
    $object.triggerEvent = function(prop, evt) {
      $(viewId + ' :input[name="'+prop+'"]')
        .not('.excludeFromModel')
        .trigger(evt);
        
      return $object;
    };
    
    /**
     * AddProperty
     * 
     * Add a property to the Model
     * 
     * @method AddProperty
     * @param {String} prop The property name 
     * @return {Object} The object (itself)
     */
    $object.AddProperty = function(prop) {
      $object
        .AddEvents()
        .AddGetSet(prop)
        .triggerEvent(prop, 'keyup');
      console.log("Added property " + prop + " to the Model.");
      return $object;
    };
    
    /**
     * RemoveProperty
     * 
     * Remove a property from the Model
     * 
     * @method RemoveProperty
     * @param {String} prop The property name 
     * @return {Object} The object (itself)
     */
    $object.RemoveProperty = function(prop) {
      $object.RemoveGetSet(prop);
      delete $object[prop];
      $(viewId + ' :input[name="'+prop+'"]')
        .not('.excludeFromModel')
        .remove();
      console.log("Removed property " + prop + " from the Model.");
      return $object;
    };
    
    /**
     * Set
     * 
     * Notice: Must only be used if 'reflectModelChangeInView' is TRUE.
     * 
     * When you need to update a value in the Model and reflect in the View.
     * 
     * @method Set
     * @param {String} prop The object's property name
     * @param {String} value The new value to set for the property
     * @return {Object} The object (itself)
     */
    $object.Set = function(prop, value) {
      //alert("Setting");
      //console.log("Set()");
      //$(obj).trigger('set'+Common.FstChrUp(key), [val]);
      //$($object).triggerHandler('set'+prop, [value]); ?
      $($object).triggerHandler('set'+prop, [value]);
      //Update databound DOM values 
      $object.SetDataboundDomVal(viewId, prop, value);
      return $object;
    };
    /**
     * Get
     * 
     * Notice: Must only be used if 'reflectModelChangeInView' is TRUE.
     * 
     * @method Get
     * @param {String} prop The object's property name
     * @return {Object} value The value from the object's property 
     * @return {Object} The object (itself)
     */
    $object.Get = function(prop) {
      //http://stackoverflow.com/questions/9145347/jquery-returning-value-from-trigger
      //console.log("Get()");
      var result = { value : undefined };
      //$($object).triggerHandler('get'+Common.FstChrUp(key), [result]);
      //$($object).triggerHandler('get'+prop, [result]); ?
      $($object).triggerHandler('get'+prop, [result]);
      return result['value'];
    };
    
    
    /**
     * GetViewData
     * 
     * Return the View data as an JSON object literal.
     * 
     * @method GetViewData
     * @return {Object} The View data as JSON object
     */
    $object.GetViewData = function() {
      //console.log("GetViewData()");
      //Get the values from the View (DOM)
      return $(viewId).getSetHtml();
    };
    
    /**
     * SetViewFromModel
     * 
     * Updates the elements in the View from the Model.
     * 
     * @method SetViewFromModel
     */
    $object.SetViewFromModel = function() {
      //console.log("SetViewFromModel()");
      //Set the values in the DOM
      //alert(JSON.stringify($object));
      $(viewId).getSetHtml($object);
      return $object;
    };
    
    /**
     * SetModelFromView
     * 
     * Update the model and databound elements.
     * 
     * This method is internally every time a 'change' and 'keyup' event occur 
     * in form elements. This is part of the concept to always update the Model, 
     * so it is synchronized with the View.
     * 
     * It is possible to override the call to this method for the 'keyup' event
     * if it is implemented manually in the settings. Therefore it's important
     * to know that if overriding this event, but still want 'live' updating 
     * of the Model to occur, then this method must be called from the custom
     * implementation of the 'keyup' event! 
     * 
     * @method SetModelFromView
     * @param {Boolean} updateDataboundValues TRUE | FALSE - If undefined or 
     * true, databound elements inside and/or outside the the View will also 
     * get updated. If false, then they won't. 
     * @return {Object} The object (itself)
     */
     //$object.SetModelFromView = function(updateDataboundValues) {
     $object.SetModelFromView = function() {
      //console.log("SetModelFromView()");
      //Get the values from the View (DOM)
      var data = $object.GetViewData();
      //Update the model using the View values
      $.each(data, function(key, newVal) {
        var oldVal = $object[key];
        //Only update values if they're changed
        //Check the value of oldVal (not newVal)
        var valType = typeof oldVal;
        if(oldVal !== newVal) {
          //alert("Key: " + key + "\nOld value: " + oldVal + " (" + typeof oldVal + ")\nNew value: " + newVal + " (" + typeof newVal + ")");
          //A problem arises when comparing object literals!!!
          //should valType (string, number, boolean, object, undefined, function)
          //be used for anything?
          //When the property has not been defined in the Model, but in the View
          //the value will be undefined and therefore also the type.
          //In some cases this should be handled differently!
          //if(valType === 'string' || valType === 'number' || valType === 'boolean' || valType === 'object' || valType === 'undefined') {
            
            //alert(key + ": " + oldVal + " changed to " + newVal);
            
            //Update the model with the value from DOM
            $object[key] = newVal;
            //$object.Set(key, newVal);
            //if(updateDataboundValues === undefined || updateDataboundValues === true) {
              //alert("OK");
              //Update databound DOM values 
              $object.SetDataboundDomVal(viewId, key, newVal);
            //}
            
          //}
          //else {
          //  alert("Missing implementation of primitive types in SetModelFromView() method for type: " + valType);
          //}
        }
      });
      //Return the values in JSON format
      //return data;
      return $object;
    };
    
    /**
     * SetDataboundDomVal
     * 
     * Update the databound elements inside or outside the View.
     * 
     * @method SetDataboundDomVal
     * @param {String} datasrc A viewId.
     * @param {String} name An element's name.
     * @param {String} value A new value.
     * @return {Object} The object (itself)
     */
    $object.SetDataboundDomVal = function(datasrc, name, value) {
      //console.log("SetDataboundDomVal()");
      //The following works fine, except it breaks in IE<9!!!
      //$('[datasrc='+datasrc+'][name='+name+']').text(value).val(value);
      //This works though:
      //console.log(counter + " - datasrc: " + datasrc + " - name: " + name + " - value: " + value);
      $('div[datasrc|='+datasrc+'][name|='+name+'],p[datasrc|='+datasrc+'][name|='+name+'],span[datasrc|='+datasrc+'][name|='+name+']').text(value);
      $('input[datasrc|='+datasrc+'][name|='+name+']').val(value);
      //counter++;
      return $object;
    };
    
    /**
     * RunEvent
     * 
     * Trigger an event if specified in the settings.
     * 
     * @method RunEvent
     * @param {String} event The eventName to trigger/execute.
     * @return {Object} The object (itself)
     */
    $object.RunEvent = function(event) {
      //alert(event.target.name);
      var type = event.type;
      if(type === undefined) {
        type = event;
      }
      if(event === undefined) {
        //console.log('event "e" is undefined!');
        return;
      }
      if($.trim(event.target.name).length > 0) {
        if($settings['settings'][type] !== undefined && $settings['settings'][type] !== null) {
          $settings['settings']['eventUsed'] = type;
          //console.log(type);
          $settings['settings'][type](event, event.target.name, event.target.value);
        }
      } else {
        console.log("source element has no name attribute assigned (required!)");
      }
      return $object;
    };
    
    /**
     * RunCtr
     * 
     * Execute a method in the controller.
     * 
     * @method RunCtr
     * @param {String} method The methods name specified in the controller.
     * @param {Object} par If needed you can provide optional parameters.
     * @return {Object} The object (itself)
     */
    $object.RunCtr = function(method, par) {
      var exec = $object['settings']['controller'][method];
      if(exec !== undefined && exec !== null) {
        exec(par);
      } else {
        console.log('Missing ' + method + '() method!');
      }
      return $object;
    };
    
    /**
     * toArray
     * 
     * Convert the object to a real Array.
     * 
     * @method toArray
     * @return {Array} The object converted into a real Array.
     */
    $object.toArray = function() {
      return $.makeArray($object);
    };
    
    /**
     * GetViewId
     * 
     * Get the ID of the View
     * 
     * @method GetViewId
     * @return {String} The View ID
     */
    $object.GetViewId = function() {
      return $object['settings']['viewId'];
    };
    
    /**
     * FindElement
     * 
     * Find and return one or many element/s within the View using a (id or class) selector.
     * 
     * If the elemenet is not found an empty array is returned.
     * 
     * @method FindElement
     * @return {Array} An element from the View.
     */
    $object.FindElement = function(selector) {
      return $($object.GetViewId() + ' ' + selector);
    };
    
    /**
     * AddEvents
     * 
     * Add events to the object's input fields
     * 
     * @method AddEvents
     * @return {Object} The object
     */
    $object.AddEvents = function() {
      //Update the model view, whenever a change occurs
      $(viewId + ' :input')
        .not('.excludeFromModel')
        .focus(function(e){
          //http://jsfiddle.net/PKVVP/
          $object.RunEvent(e);
        })
        .blur(function(e) {
          $object.RunEvent(e);      
        })
        .change(function(e){
          //Update the model and also the databound elements
          //MVC.SetModelFromView(viewId, $object); //Always do this (core concept!)
          $object.SetModelFromView(); //Always do this (core concept!)
          $object.RunEvent(e);
        })
        .select(function(e) {
          $object.RunEvent(e);
        })
        .submit(function(e){
          $object.RunEvent(e);
        })
        /**
         * keyup event
         * 
         * It's important to know that when overriding this event, 
         * but still want 'live' updating of the Model to occur,
         * then this method must be called from the custom implementation 
         * of the 'keyup' event!
         * 
         * @event keyup ...
         * 
         */
        .keyup(function(e){
          //console.log("keyup");
          //If the 'keyup' event hasn't been specified in the settings, then
          //by default update the Model and databound values using the
          //SetModelFromView() method
          if($settings['settings']['keyup'] === undefined) {
            //$object.SetDataboundDomVal(viewId, e.target.name, e.target.value);
            $object.SetModelFromView();
          }
          $object.RunEvent(e); //e should euqal 'change' 
          /*var n = $(this).attr('name');
          var v = $(this).val();
          MVC.SetDataboundDomVal(viewId, n, v);*/
        })
        .keypress(function(e) {
          $object.RunEvent(e);
        })
        .keydown(function(e) {
          $object.RunEvent(e);
        })
        .mouseenter(function(e) {
          $object.RunEvent(e);
        })
        .mouseleave(function(e) {
          $object.RunEvent(e);
        });
        return $object;
    };
    
    // END: Internal methods
    
    // START: Setup
    
    //Set the DOM values from the Model
    //MVC.SetViewFromModel(viewId, $object);
    $object.SetViewFromModel();
    //Initialize the View with the Model data if they aren't specified in the Model
    //MVC.SetModelFromView(viewId, $object);
    $object.SetModelFromView();
    
    //If Model property changes should be reflected/displayed in the View:
    //Loop throught the properties within the object and attach events using the
    //jQuery .bind() method. Whenever the user wants to update a value it can 
    //be achieved using the .trigger() method, which is implemented in the
    //MVC.Set() and MVC.Get() methods.
    //Note: Changing the Model's properties directly won't update the view.
    if($settings['reflectModelChangeInView']) {
      //alert("reflect on");
      //Loop throught the object's properties
      $.each($object, function(k,v) {
        //alert(k + " : " + v);
        //var pars = MVC.GetViewData(viewId);
        //Add the Getter and Setter methods
        //n: name, ov: old value, nv: new value
        //MVC.AddGetSet($object, k, function(n, ov, nv) {
        $object.AddGetSet(k);/*, function(n, ov, nv) {
          //alert(n + ": " + ov + "=>" + nv);
          //Update the view accordingly
          //MVC.SetViewFromModel(viewId, $object); //$(viewId).getSetHtml($object);
          $object.SetViewFromModel();
          
          //Make sure that the input will have the change event triggered,
          //so that the views bound to this element will also be updated.
          //This is important in case the model is changed using setTimeout()
          //which will update the model, then this change must simulate
          //a user setting the value of the input. 
          $(':input[name='+n+']').not('.excludeFromModel').trigger('change');
        });*/
      });
    }
    
    if($settings['autoSaveInterval'] > 0) {
      $settings['eventUsed'] = '"autoSave"';
      setInterval(function() { 
        $object.Save();
      }, $settings['autoSaveInterval']);
    }
    
    $object.AddEvents();

    //Add the settings to the Model object
    $settings = { settings : $settings };
    //$.extend($object, $settings);
    //Add the data to the Model object
    //$data = { data : $data };
    $.extend($object, $settings);
    //alert(JSON.stringify($object, null, 2));
    
    
    /**
     * To keep the code which belongs to the object, but normally would be 
     * placed after object instantiation, we isntead want to place it inside
     * the .init() method, which gets executed 1ms after the object has been
     * created.
     * 
     * Why we use setTimeout: read below...
     * 
     * In some cases the user wants to call the object itself like this:
     * 
     * 
     * //Create a new object
     * obj = MVC.ModelView('#viewId', {
     *   //Data:
     *   foo : 'bar',
     *   //Method
     *   aCustomMethod : function() {
     *    //does something
     *   }
     *   init : function() {
     *     //All methods and other 'stuff' placed inside the .init() method
     *     //gets executed immediately after the object has been created (setup).
     *     //Therefore it's important (and necessary) to use setTimeout, as the
     *     //object actually hasn't been created yet. So we set it to 1 ms! 
     *     obj.aCustomMethod();
     *   }
     * }
     * });
     */
    var init = $object['init'];
    //Do not run the .init() method if it is undefined or null!
    if(init !== undefined && init !== null) {
      setTimeout(function() {
        init();
      }, 1);
    }
    
    return $object;
  }
};

/**
 * Get or set HTML (DOM) values
 * 
 * Inspired by formParams: http://jquerypp.com/#formparams
 * 
 * @param {Object} jQuery
 */
(function( $ ) {
  $.fn.extend({
    getSetHtml: function( params ) {
      if(params !== undefined) {
        return this.setValues(params);
      }
      else {
        return this.getValues();
      }
    },
    getInputElements : function(target) {
      return target.find('input,select,textarea').filter(':not(.excludeFromModel)');
    },
    getElementKey : function(element) {
      var key = $(element).attr("datafld");
      if(key === undefined) {
        key = $(element).attr("id");
      }
      return key;
      //return $(element).attr("datafld") ? undefined : $(element).attr("id"); 
    },
    getDivElements : function(target) {
      return target.find('p,span,div').filter(':not(.excludeFromModel)');
    },
    setValues : function(params) {
      //console.log('setValues called!');
      //console.log(this.getDivElements(this));
      //Set the values for  'p', 'div' and 'span' elements
      var $this = this;
      $this.getDivElements(this).each(function() {
        var key = $this.getElementKey(this);
        if(key === undefined) {
          return;
        }
        //alert(key);
        var value = params[key];
        //alert(key + " = " + value);
        //console.log(value);
        $(this).html(value);
        //var toReplace = $.trim($(this).text());
        //alert(toReplace);
      });
      
      $this.getInputElements(this).each(function(){
        var value = params[ $(this).attr("name") ], $this;
        // Don't do all this work if there's no value
        if ( value !== undefined) {
          $this = $(this);
          
          if ( $this.is(":radio") ) {
            if ( $this.val() === value ) {
              $this.attr("checked", true);
            }
          } else if ( $this.is(":checkbox") ) {
            // Convert single value to an array to reduce
            // complexity
            if(value) {
              $this.attr("checked", true);
            }
            else {
              value = $.isArray( value ) ? value : [value];
              if ( $.inArray( $this.val(), value ) > -1) {
                $this.attr("checked", true);
              }
            }
            $this.val( value );
          } else {
            $this.val( value );
          }
        }
      });
      
    },
    getValues : function() {
      var data = {},      
          formData = {};
      var $this = this;
      $this.getInputElements(this).each(function() {
        var elm = $(this);
        var type = elm.attr('type'),
            name = elm.attr('name'),
            value = elm.val();
        if(type === 'submit' || !name) {
          return;
        }
        
        //console.log("type: " + type + " - name: " + name + " - value: " + value);
        if(elm.hasClass('isNumber')) {
          value = parseInt(value);
        }
        
        if(elm.is(':checkbox')) {
          value = false;
          if(elm.attr('checked')) {
            value = true;
          }
          formData[name] = value;
        }
        else if(elm.is(':radio')) {
          if(elm.attr('checked')) {
            formData[name] = value;
          }
        }
        else {
          formData[name] = value;
        }
      });
      
      $this.getDivElements(this).each(function() {
        var elem = $(this);
        var value = elem.text();
        if(value !== undefined) {
          var key = $this.getElementKey(this);
          if(key === undefined) {
            return;
          }
          if(elem.hasClass('isNumber')) {
            value = parseInt(value);
          } 
          //alert(key + " = " + value);
          data[key] = value;
        }
      });
      $.extend(data, formData);
      //alert(CMN.JSON.stringify(data, null, 2));
      return data;
    }
  });
})(jQuery);