// ==========================================================================
// Project:     Simple.mvc.js - A lightweight MVC library for UI binding.
// Copyright:   (c)2012-2016 Benjamin Hammer (hammerbenjamin@gmail.com)
// Version:     2016.2.24
// Licence:     Licensed under MIT license (see LICENCE.MD)
// Description:
//     * README.MD
//     * http://github.com/bnji/simplemvc
//     * http://hammerbenjamin.com/simplemvc
// ==========================================================================
/**
 *     Design rules:
 *     1) Capitalization
 *        Internal methods (except .toArray()) should have the
 *        first letter capitalized, so it's possible to
 *        distinguish between internal JavaScript methods and
 *        Simple.mvc ModelView object. methods.
 *
 *     2) Bracket vs Dot notation
 *        Older versions of IE don't accept the use of
 *        accessing a an object's property using dot-
 *        notation (obj.propertyName). However,
 *        accessing the property using bracket notation
 *        will work (obj['propertyName']).
 *
 *
 * @module MVC
 * @main MVC
 */
var MVC = {
  /**
   * KeyCheck
   *
   * A friendly way to check which key was used.
   *
   * @method KeyCheck
   * @param {Object} e Event
   * @param {String} n Name of the key to check against (e.g. 'enter', 'escape')
   */
  KeyCheck : function(e, n) {
    if(e.keyCode === 13 && (n === 'enter' || n === 'return')) {
      return true;
    } else if(e.keyCode === 27 && (n === 'escape' || n === 'esc')) {
      return true;
    }
    return false;
  },
  /**
   * List
   *
   * A more human way of handling array's in JavaScript. It provides some extra
   * methods for manipulating an array, which makes it more easy and semantic
   * such as when e.g. adding and removing elements using .Add() and .Remove().
   *
   * @class List
   * @param {Object} An array (is optional)
   */
  List : function(array) {
    //If 'array' hasn't been specified, then create an empty Array.
    if(array === null || array === undefined) {
      array = [];
    }
    //If the input array is an object literal, then convert it to an array
    else if(!$.isArray(array) && typeof(array) === 'object') {
      //array = $.makeArray(array);
      var newArray = [], i = 0;
      $.each(array, function(k, v) {
        if(typeof v !== 'function') {
          newArray[i] = v;
          i++;
        }
      });
      array = newArray;
    }

    /**
     * Size
     *
     * Return the length of the array (same as array.length);
     * @return {Number} The length of the array.
     */
    array.Size = function() {
      return array.length;
    };

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
     * Get
     *
     * Get an element from the array.
     *
     * @method Get
     * @param {Integer} A key.
     * @return {Object} An object from the array.
     */
    array.Get = function(key) {
      return array[key];
    };

    /**
     * Find
     *
     * Find an element in the array. Returns null, if nothing is found.
     *
     * @method GetById
     * @param {Object} A key.
     * @param {Object} A value to search for.
     * @return {Object} An object from the array.
     */
    array.Find = function(key, value) {
      var result = null;
      $.each(array, function(k,v) {
        if(v[key] === value) {
          result = v;
          return false;
        }
      });
      return result;
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
      // More about deleting elements from an array in JavaScript:
      // http://stackoverflow.com/questions/500606/javascript-array-delete-elements
      // indexOf breaks in IE < 9!
      // var i = array.indexOf(element);
      // Solution:
      var i = $.inArray(element, array);
      if(i !== -1) {
        array.splice(i, 1);
        return true;
      }
      return false;
    };

    /**
     * RemoveAt
     *
     * Remove an element at index (if found) from the array.
     *
     * @method RemoveAt
     * @param {Integer} Index.
     */
    array.RemoveAt = function(index) {
      return this.Remove(this.Get(index));
    };

    /**
     * Contains
     *
     * Check if the specified element is in the list
     *
     * @method Contains
     * @param {Object} An element.
     */
    array.Contains = function(element) {
      return $.inArray(element, array) !== -1;
    };

    /**
     * Clear
     *
     * Remove all the elements from the array.
     *
     * @method Clear
     */
    array.Clear = function() {
      //array.splice(0, array.length);
      array = [];
    };
    return array;
  },
  /**
   * Controller which handles the logic, such as saving, updating or deleting
   * the object.
   *
   * Defintion
   * Controller: The controller interprets the mouse and keyboard inputs from the user,
   * informing the model and/or the view to change as appropriate.
   * Source: http://bit.ly/fQnaJI
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
  }
  //ModelView has code is now written as a jQuery plugin: simple.mvc.jquery.js
};

/**
 * ModelView written as a jQuery plugin (most basic form of plugin authoring).
 *
 * Reasons for this:
 *  Several... but mainly just trying to make it easier for anyone who already
 *  knows jQuery gettings started using Simple.mvc.
 *
 * For more information on different jQuery plugin design patterns:
 * https://github.com/addyosmani/jquery-plugin-patterns/tree/master/patterns
 *
 */
(function( $ ) {
  $.fn.extend({
    /**
     * ModelView
     *
     * Definition:
     * Model: The model manages the behavior and data of the application domain,
     * responds to requests for information about its state (usually from the view),
     * and responds to instructions to change state (usually from the controller).
     * View: The view manages the display of information.
     * Source: http://bit.ly/fQnaJI
     *
     * ModelView creates the glue which binds the UI(View) with the Backend code
     * functionality of the program. It keeps the View synchronized with the 'Model'.
     *
     * ModelView creates a new object with data and settings. The data and
     * settings are (JSON) object literals and merged and returned after all the
     * internal setup is done.
     * The ModelView contains all the information about the object, which keeps
     * the View synchronized with the Model and vice versa.
     *
     * @class ModelView
     * @constructor
     *
     * @param {Object} $object   Model data
     * @param {Object} $settings Config & view input events
     * @param {Object} $methods  Custom user defined methods/functions
    */
    ModelView: function( $object, $settings, $methods ) {
      var computedProperties = [];
      $this = $(this);
      var viewId = '#'+$this.attr('id');
      // Make sure that the object data always exists. Only require 'viewId'
      if(!$object) {
        $object = {};
      }
      else {
        $object = $.extend({}, true, $object);
      }
      // Make sure that the object methods always exists. Only require 'viewId'
      if(!$methods) {
        $methods = {};
      }
      else {
        $object = $.extend({}, true, $object, $methods);
      }
      // Make sure that the settings always exist and with certain properties.
      if(!$settings) {
        $settings = {};
      }
      var datasrc = $settings['datasrc'];
      var clone = $settings['clone'];
      // If cloning-'functionality' is implemented:
      if(clone !== undefined) {
        // Set the clone template to be the view id
        clone['template'] = viewId;
        // Update the view id with the new clone id
        if(clone['id'] === undefined) {
          viewId = "#" + $.now();
        }
        else {
          // Make sure it's a string
          viewId = '' + clone['id'];
        }
        // If the clone view id has hashtag specified
        if(viewId.substring(0, 1) === '#') {
          viewIdNoHash = viewId.substring(1, viewId.length);
        }
        // If there's no hashtag
        else {
          viewIdNoHash = viewId;
        }
        // Clone the source and update the viewId
        var withDataAndEvents = $settings['clone']['withDataAndEvents'];
        withDataAndEvents = withDataAndEvents !== undefined ? withDataAndEvents : false;
        $settings['clone']['withDataAndEvents'] = withDataAndEvents;
        var element = $($(clone['template']).clone(withDataAndEvents)).attr('id', viewIdNoHash);
        // datasrc property to the settings, as it should be possible to create a
        // ModelView without any data, but solely relies on receiving updated
        // values from another view!
        // If the datasrc isn't specified, then use the viewId as datasrc.
        datasrc = datasrc !== undefined ? datasrc : viewId;
        // Update the datasrc with the new view id
        $(element).find('[datasrc=""]').attr('datasrc', datasrc);
        // If the template originally was hidden using 'display: none;' - make it visible
        // Append the copy to the target
        // Execute the append callback function which normally would involve
        // appending and making it visible (If the template originally was hidden using 'display: none;' - make it visible to the user)
        // e.g.
        //  Suppose we(you) in the callback function name the element 'elem':
        //  $('#someElementId').append(elem); //append it
        //  $(elem).show();                   //make it visible
        // Execute the callback function:
        clone['append'](element);
      }
      if($settings['viewId'] === undefined) {
        $.extend($settings, {viewId : viewId});
      }
      if($settings['isMirror'] === undefined) {
        $.extend($settings, {isMirror : true});
      }
      if($settings['eventUsed'] === undefined) {
        $.extend($settings, {eventUsed : ''});
      }
      if($settings['preventDefault'] === undefined) {
        $.extend($settings, {preventDefault : true});
      }
      // Attach events to the save, update, delete (more?) buttons/submit.
      // For IE we need to specify each element with the viewId individually!
      // $(viewId + ' button,' + viewId + ' a,' + viewId + ' submit,' + viewId + ' i')
      $(viewId).find('*')
        .each(function(i, e) {
          if($(this).hasClass('isEvent')) {
            $(this)
            //.attr('id', e.id+'_'+viewId)//NoHash)
            .click(function(e) {
              // $object.Start($id, par);
              // $object.Save();
              // console.log("target name (jQuery): " + $(e.target).attr('name'));
              // console.log("target name (JS): " + e.target.name);
              // e.target.name is not working on custom elements, such as
              // <foobar href="#" name="clearAll" class="isEvent">
              //  Click me
              // </foobar>
              var targetName = $(e.target).attr('name'); // e.target.name
              $object.Start(targetName, e);
              if($settings['settings']['preventDefault']) {
                e.preventDefault();
              }
            });
          }
          //console.log(i + " " + e.id);
        });

      // Start: Methods

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
        return $object.Start('Save', par);
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
        return $object.Start('Update', par);
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
        return $object.Start('Delete', par);
      };

      /**
       * Clear
       *
       * Clears a property's value in the Model and optionally in the View if 'isMirror' = true.
       *
       *
       * @method Clear
       * @return {Object} The object (itself)
       */
      $object.Clear = function(prop) {
        $object.Set(prop, '');
        $object[prop] = '';
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
        $.each($object.GetModelData(), function(prop) {
          $object.Clear(prop);
        });
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
       * Note: Will only be used(exec.) if 'isMirror' is TRUE.
       *
       * Works in IE 7+: http://jsfiddle.net/cTJZN/
       *
       * @method AddGetSet
       * @param {String} prop The object's property name
       * @param {Function} onUpdate callBack function will execute, whenever
       * the get/set event handlers bound with .bind() method are triggered.
       * @return {Object} The object (itself)
       */
      $object.AddGetSet = function(prop) {//, onUpdate) {
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
              //Update the view accordingly
              $object.SetViewFromModel();
              //Make sure that the input will have the change event triggered,
              //so that the views bound to this element will also be updated.
              //This is important in case the model is changed using setTimeout()
              //which will update the model, then this change must simulate
              //a user setting the value of the input.
              $object.TriggerEvent(prop, 'change');//.TriggerEvent(prop, 'keyup');
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
       * @method TriggerEvent
       * @param {String} prop Property name
       * @param {String} evt Event type/name (e.g. 'keyup')
       * @return {Object} The object (itself)
       */
      $object.TriggerEvent = function(prop, evt) {
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
      $object.AddProperty = function(prop, value) {
        //Add the propery to the Model
        $object[prop] = value;
        // console.log("Add Property....");
        // console.log($object);
        $object
          //.AddEvents()
          .AddGetSet(prop);
          //.TriggerEvent(prop, 'keyup');
        // console.log("Added property " + prop + " to the Model.");
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
        //$object.Find('[name="'+prop+'"]')
        //$(viewId + ' :input[name="'+prop+'"]')
          //.not('.excludeFromModel')
          //.remove();
        // console.log("Removed property " + prop + " from the Model.");
        return $object;
      };

      /**
       * Remove
       *
       * NOTE: Must only be used if 'isMirror' is TRUE.
       *
       * Removes an item from a list object in the model and updates the View.
       *
       * @method Add
       * @param {String} listName The object's property name
       * @param {String} item The new value to add to the property list
       * @return {Object} The object (itself)
       */
      $object.Remove = function(listName, prop) {
          var room = $object.Get(prop);
          var rooms = $object.Get(listName);
          rooms.Remove(room);
          $object.FillSelect(listName);
      };

      /**
       * Add
       *
       * NOTE: Must only be used if 'isMirror' is TRUE.
       *
       * Adds an item to a list object in the model and updates the View.
       *
       * @method Add
       * @param {String} listName The object's property name
       * @param {String} item The new value to add to the property list
       * @return {Object} The object (itself)
       */
      $object.Add = function(listName, item) {
          var list = $object.Get(listName);
          list.Add(item);
          $object.FillSelect(listName);
      };

      /**
       * Set
       *
       * NOTE: Must only be used if 'isMirror' is TRUE.
       *
       * When you need to update a value in the Model and reflect in the View.
       *
       * @method Set
       * @param {String} prop The object's property name
       * @param {String} value The new value to set for the property
       * @return {Object} The object (itself)
       */
      $object.Set = function(prop, value){
        if(typeof value === 'function') {
          computedProperties.push({ 'name': prop, 'func': value });
          value = value($object);
        }
        // Add property to model if it's not there already.
        // Scenario: User has Model & View without this property, but uses .Set()
        // to set a value in the Model & View, then it should be added!
        // NOTE: isMirror should be TRUE !!! IMPORTANT !!! - by design.
        if($object['settings']['isMirror'] && !$object.Has(prop)) {
          $object.AddProperty(prop, value);
        }
        // var value2 = [value];
        // if(typeof $object.Get(prop) === 'object') {
        //   value2 = [value2];
        // }
        // console.log(prop + " - " + [value]);
        $($object).triggerHandler('set'+prop, [value]);
        //Update databound DOM values
        //Update databound elements with datasrc if specified, otherwise with viewId.
        $object._SetDataboundDomVal(datasrc ? datasrc : viewId, prop, value);
        return $object;
      };

      /**
       * Get
       *
       * NOTE: Must only be used if 'isMirror' is TRUE.
       *
       * @method Get
       * @param {String} prop The object's property name.
       * @return {Object} value The value from the object's property.
       */
      $object.Get = function(prop) {
        //http://stackoverflow.com/questions/9145347/jquery-returning-value-from-trigger
        var result = { value : undefined };
        $($object).triggerHandler('get'+prop, [result]);
        return result['value'];
      };

      /**
       * Has
       *
       * Checks if the Model has a given property (true) or not (false).
       *
       * @method Has
       * @param {String} prop The object's property name
       * @return {Boolean} TRUE if the property exists. Otherwise FALSE.
       */
      $object.Has = function(prop) {
        if($object.Get(prop) !== undefined) {
          return true;
        }
        return false;
      };

      /**
       * GetDatasrcId
       *
       * Return the (view) ID of the datasource.
       *
       * @method GetDatasrcId
       * @return {Number} The (View) ID of the datasource.
       */
      $object.GetDatasrcId = function() {
        return $object.datasrc;
      };

      /**
       * GetModelData
       *
       * Return's a copy of the Model's data without it's functions.
       * Useful when storing the data.
       *
       * Note: As this object has all of it's functions/methods removed, then
       * it's not possible to use the .toArray() (if needed for any reason) anymore.
       * Instead use $.makeArray(theObject); which is what .toArray() uses.
       *
       * @method GetModelData
       * @param {Boolean} withSettings If TRUE, then append the settings object.
       * @return {Object} A copy of the Model's data (as JSON object literal).
       */
      $object.GetModelData = function(withSettings) {
        var modelObjectData = {};
        $.each($object, function(k, v) {
          // Only add types which aren't functions
          if((typeof v).toString() !== 'function') {
            //Don't add the jQuery object which is used for .Set() & .Get()
            //Regex test on Rubular: http://www.rubular.com/r/KZQH0gdHyy
            if((/jQuery\d*/).test(k)) {
              return true;
            }
            //Only add the settings object if withSettings is TRUE.
            else if(!withSettings && k === 'settings') {
              return true;
            }
            //Add strings and objects (JSON literals and Arrays)
            else {
              modelObjectData[k] = v;
            }
            //console.log(k + " is a " + typeof v);
          }
        });
        return modelObjectData;
      };

      /**
       * GetViewHtml
       *
       * Returns the jQuery object.
       * @method GetViewHtml
       * @return {Object} jQuery object.
       */
      $object.GetViewHtml = function() {
        return $this;
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
       * SetViewData
       *
       * Set the View data from the Model (does not update databound elments)
       *
       * @method SetViewData
       * @return {Object} The object (itself)
       */
      $object.SetViewData = function() {
        //Set the values in the DOM
        $(viewId).getSetHtml($object);
      };

      /**
       * SetViewFromModel
       *
       * Updates the elements in the View from the Model (including databound elements).
       *
       * @method SetViewFromModel
       */
      $object.SetViewFromModel = function() {
        //console.log("SetViewFromModel()");
        $object.SetViewData();
        var data = $object.GetModelData();
        // console.log(JSON.stringify(data));
        //Update the databound values!!!
        $.each(data, function(key, newVal) {
          $object._SetDataboundDomVal(viewId, key, newVal);
        });
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
       * @param {Boolean} updateDataboundValues TRUE | FALSE - If undefined or
       * true, databound elements inside and/or outside the the View will also
       * get updated. If false, then they won't.
       * @return {Object} The object (itself)
       */
       $object.SetModelFromView = function() {
        // Get the values from the View
        var data = $object.GetViewData();
        // console.log(JSON.stringify(data));
        // Update the model using the View values
        $.each(data, function(key, newVal) {
          var oldVal = $object[key];
          // console.log("SetModelFromView() - key: " + key + ", new value: " + newVal + ", old value: " + oldVal);
          // Only update values if they're changed
          // Check the value of oldVal (not newVal)
          // newVal should not be null or undefined!
          if(oldVal !== newVal && (newVal !== undefined && newVal !== null)) { // && typeof oldVal === typeof newVal) {
            // console.log("Key: " + key + "\nOld value: " + oldVal + " (" + typeof oldVal + ")\nNew value: " + newVal + " (" + typeof newVal + ")");
            // Update the model with the value from DOM
            $object[key] = newVal;
          }
          // Update databound DOM values even when setting the values on .init()
          // the databound items should ofcourse get updated even if the model
          // data is same as in the view.
          $object._SetDataboundDomVal(viewId, key, newVal);
        });
        // Update computed properties
        $.each(computedProperties, function(k,v) {
          $object.Set(v['name'], v['func']($object));
        });
        return $object;
      };

      /**
       * Update the databound elements inside or outside the View.
       *
       * @method _SetDataboundDomVal
       * @private
       * @param {String} datasrc A viewId.
       * @param {String} name An element's name.
       * @param {String} value A new value.
       *
       * @return {Object} The object (itself)
       */
      $object._SetDataboundDomVal = function(datasrc, name, value) {
        if(value) {
          //console.log(counter + " - datasrc: " + datasrc + " - name: " + name + " - value: " + value);
          var browserVersion = navigator.appVersion;
          // IE 7 & 8
          if(browserVersion.indexOf("MSIE 7.") !== -1 || browserVersion.indexOf("MSIE 8.") !== -1) {
            // case: <span datasrc="#viewId" name="somename"></span>
            $('div[datasrc="'+datasrc+'"][name="'+name+'"],p[datasrc="'+datasrc+'"][name="'+name+'"],span[datasrc="'+datasrc+'"][name="'+name+'"]').text(value);
            // case: <div datasrc="#viewId"><span name="somename"></span></div>
            $('div[datasrc="'+datasrc+'"],p[datasrc="'+datasrc+'"],span[datasrc="'+datasrc+'"]').find('div[name="'+name+'"],p[name="'+name+'"],span[name="'+name+'"]').text(value);
            $('div[datasrc="'+datasrc+'"],p[datasrc="'+datasrc+'"],span[datasrc="'+datasrc+'"]').find('input[name="'+name+'"]').val(value);
          }
          else {
            // console.log("datasrc: " + datasrc + " - name: " + name + " - value: " + value + " - " + $('*[datasrc*="'+datasrc+'"]').find('[name*="'+name+'"]').text());
            // case: <span datasrc="#viewId" name="somename"></span>
            $('*[datasrc="'+datasrc+'"][name="'+name+'"]').text(value);
            // case: <div datasrc="#viewId"><span name="somename"></span></div>
            $('*[datasrc="'+datasrc+'"]').find('*[name="'+name+'"]').text(value);
            $('*[datasrc="'+datasrc+'"]').find('*[name="'+name+'"]').val(value);
          }
          $('input[datasrc="'+datasrc+'"][name="'+name+'"]').val(value);

          var select = $('select[datasrc="'+datasrc+'"][name="'+name+'"]');
          $object._FillSelect(select, name, value);
          select = $('*[datasrc="'+datasrc+'"]').find('select[name="'+name+'"]');
          $object._FillSelect(select, name, value);
        }
        return $object;
      };

      $object._FillSelect = function(select, name, value) {
        var propValue = $object.Get(name);
        if(typeof propValue === 'object' && select.size() > 0) {
          select.empty();
          $.each(value, function(k, v) {
            // var txt = textIsFunction ? v[name.substring(0, name.length-2)]() : v[name];
            // var val = valueIsFunction ? v[value.substring(0, value.length-2)]() : v[value];
            select.append($('<option />').attr({'value': v}).text(v));
          });
        }
      };

      /**
       * FillSelect
       *
       * Fill select element with one or more option elements.
       *
       * @method FillSelect
       * @param {Array} prop The property name which holds an array of values
       * @param {String} text The text to be displayed in the option element
       * @param {String} value The value of the option element
       * @return {Object} The object (itself)
       */
      $object.FillSelect = function(prop, text, value) {
        var textIsFunction = !text ? false : text.substring(text.length-2, text.length) === "()";
        var valueIsFunction = !value ? false : value.substring(value.length-2, value.length) === "()";
        var items = $object.Get(prop);
        $.each($object.Find('select[name*="'+prop+'"]'), function(k2,select) {
          select = $(select);
          select.empty();
          $.each(items, function(k, v) {
            var txt = !text ? v : textIsFunction ? v[text.substring(0, text.length-2)]() : v[text];
            var val = !value ? v : valueIsFunction ? v[value.substring(0, value.length-2)]() : v[value];
            select.append($('<option />').attr({'value': val}).text(txt));
          });
        });
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
        var targetName = event.target.name;
        var targetValue = event.target.value;
        //alert(targetName);
        var type = event.type;
        if(type === undefined) {
          type = event;
        }
        if(event === undefined) {
          //console.log('event "e" is undefined!');
          return;
        }
        if($.trim(targetName).length > 0) {
          if($settings['settings'][type] !== undefined && $settings['settings'][type] !== null) {
            // alert($settings['settings'][type]);
            $settings['settings']['eventUsed'] = type;
            var modelData = $object[targetName];
            var selectedModelData = modelData;
            // select element (list)
            if(event.target.type.indexOf('select') !== -1) {
              var selectedIndex = event.target.selectedIndex;
              var selectedOption = event.target.options[selectedIndex];
              if(selectedOption) {
                targetValue = selectedOption.value;
                selectedModelData = modelData[selectedIndex];
              }
            }
            $settings['settings'][type](event, targetName, targetValue, $object, modelData, selectedModelData);
          }
        }
        // else {
        //   console.log("source element has no name attribute assigned (required!)");
        // }
        return $object;
      };

      /**
       * Start
       *
       * Execute a method in the controller.
       *
       * @method Start
       * @param {String} method The methods name specified in the controller.
       * @param {Object} par If needed you can provide optional parameters.
       * @return {Object} The object (itself)
       */
      $object.Start = function(method, par) {
        var exec;
        if($object['settings']['controller'] !== undefined) {
          exec = $object['settings']['controller'][method];
        }
        if(exec === undefined) {
          exec = $object[method];
        }
        // console.log(exec);
        // console.log($object[method]);
        // console.log(par);
        if(exec !== undefined && exec !== null) {
          exec(par, $object);
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
       * Find
       *
       * Find and return one or many element/s within the View using a (id or class) selector.
       *
       * If the elemenet is not found an empty array is returned.
       *
       * @method Find
       * @return {Array} An element from the View.
       */
      $object.Find = function(selector) {
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
        // Update the model view, whenever a change occurs
        $(viewId + ' :input')
          // .not('.excludeFromModel')
          .focus(function(e){
            // http://jsfiddle.net/PKVVP
            $object.RunEvent(e);
          })
          .blur(function(e) {
            $object.RunEvent(e);
          })
          .change(function(e){
            // Update the model and also the databound elements
            $object.SetModelFromView();
            $object.RunEvent(e);
          })
          .select(function(e) {
            $object.RunEvent(e);
          })
          .submit(function(e) {
            $object.RunEvent(e);
          })
          .click(function(e) {
            // Update the model and also the databound elements
            $object.SetModelFromView();
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
            // If the 'keyup' event hasn't been specified in the settings, then
            // by default update the Model and databound values using the
            // SetModelFromView() method
            if($settings['settings']['keyup'] === undefined) {
              // Update the model and also the databound elements
              $object.SetModelFromView();
            }
            // e should euqal 'change'
            $object.RunEvent(e);
          })
          .keypress(function(e) {
            $object.RunEvent(e);
          })
          .keydown(function(e) {
            $object.RunEvent(e);
          });
          return $object;
      };
      // END: methods

      // START: Setup

      // Set the DOM values from the Model
      $object.SetViewFromModel();
      // Initialize the View with the Model data if they aren't specified in the Model
      $object.SetModelFromView();
      // If Model property changes should be reflected/displayed in the View:
      // Loop throught the properties within the object and attach events using the
      // jQuery .bind() method. Whenever the user wants to update a value it can
      // be achieved using the .trigger() method, which is implemented in the
      // MVC.Set() and MVC.Get() methods.
      // Note: Changing the Model's properties directly won't update the view.
      if($settings['isMirror']) {
        // Loop throught the object's properties
        $.each($object.GetModelData(), function(k,v) {
          // console.log(k + " : " + v);
          // var pars = MVC.GetViewData(viewId);
          // Add the Getter and Setter methods
          // n: name, ov: old value, nv: new value
          $object.AddGetSet(k);
          /*, function(n, ov, nv) {
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
      // Add the settings to the Model object
      $settings = { settings : $settings };
      $.extend($object, $settings);
      // alert(JSON.stringify($object, null, 2));
      /**
       * To keep the code which belongs to the object, but normally would be
       * placed after object instantiation, we instead want to place it inside
       * the .init() method, which gets executed right after the object has been
       * created.
       */
      var init = $object['init'];
      //Do not run the .init() method if it is undefined or null
      if(init !== undefined && init !== null) {
        init($object);
      }
      return $object;
    }
  });
})(jQuery);
/**
 * Get or set HTML (DOM) values
 *
 * Inspired by formParams: http://jquerypp.com/#formparams
 *
 * @param {Object} jQuery
 * @class getSetHtml
 */
(function( $ ) {
  $.fn.extend({
    /**
     * getSetHtml
     *
     *
     * Get or set HTML (DOM) values.
     * If you pass this method any parameters it will try to set the HTML.
     * Otherwise it will try get the HTML values from the view.
     *
     *
     * @param  {Object} params Object literal with keys that correspond with
     * either an ID or NAME attribute of an element in the View (DOM).
     * @return {Object} Object literal with data from the View (DOM).
     *
     * @method getSetHtml
     */
    getSetHtml: function( params ) {
      if(params !== undefined) {
        return this.setValues(params);
      }
      else {
        return this.getValues();
      }
    },
    getInputElements : function(target) {
      return target.find('input,select,textarea').not('.excludeFromModel');
    },
    getElementKey : function(element) {
      var key = $(element).attr("datafld");
      if(key === undefined) {
        key = $(element).attr("id");
      }
      if(key === undefined) {
        key = $(element).attr("data-bind");
      }
      return key;
      //return $(element).attr("datafld") ? undefined : $(element).attr("id");
    },
    getBindableElements : function(target) {
      //return target.find('p,span,div').filter(':not(.excludeFromModel)');
      return target.find('*[data-bind], *[datafld]').filter(':not(.excludeFromModel)');
    },
    setValues : function(params) {
      //console.log('setValues called!');
      //console.log(this.getBindableElements(this));
      //Set the values for  'p', 'div' and 'span' elements
      var $this = this;
      $this.getBindableElements(this).each(function() {
        var key = $this.getElementKey(this);
        if(key === undefined) {
          return;
        }
        //alert(key);
        var value = params[key];
        // console.log(key + " = " + value);
        //console.log(value);
        $(this).html(value);
        //var toReplace = $.trim($(this).text());
        //alert(toReplace);
      });

      $this.getInputElements(this).each(function(){
        var value = params[ $(this).attr("name") ], $this;
        // console.log(value);
        // Don't do all this work if there's no value
        if ( value !== undefined) {
          $this = $(this);
          // Select element
          if ( $this.is("select") ) {
            // Fill select with option elements if select value is null
            if(!$this.val()) {
              var selectElement = $this;
              selectElement.empty();
              $.each(value, function(k,v) {
                var txt = v;
                var val = v;
                if(typeof v === 'object') {
                  $.each(v, function(k2,v2) {
                    var k2isFunc = typeof k2 === 'function';
                    var v2isFunc = typeof v2 === 'function';
                    // console.log(v2isFunc);
                    txt = v2isFunc ? v.toString() : k2;
                    val = v2isFunc ? v.toString() : v2;
                  });
                }
                // console.log("text: " + txt + " - value: " + val);
                selectElement.append($('<option />').attr({'value': val}).text(txt));
              });
            }
            else {
              // alert($this.attr('name') + " has values!");
            }
          }
          // Radio element
          else if ( $this.is(":radio") ) {
            if ( $this.val() === value ) {
              $this.attr("checked", true);
            }
          }
          // Checkbox element
          else if ( $this.is(":checkbox") ) {
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
          }
          // Other elements
          else {
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
          value = parseInt(value, null);
        }

        // Select element
        if(elm.is('select')) {
          var selectValues = MVC.List([]);
          $.each(elm.find('option'), function(k,v) {
            // selectValues.push($(v).val());
            selectValues.Add($(v).val());
          });
          value = selectValues;
          formData[name] = value;
        }
        // Checkbox element
        else if(elm.is(':checkbox')) {
          value = false;
          if(elm.attr('checked') | elm.prop('checked')) {
            value = true;
          }
          formData[name] = value;
        }
        // Radio element
        else if(elm.is(':radio')) {
          if(elm.attr('checked') | elm.prop('checked')) {
            formData[name] = value;
          }
        }
        // Other elements
        else {
          formData[name] = value;
        }
      });

      $this.getBindableElements(this).each(function() {
        var elem = $(this);
        var value = elem.text();
        if(value !== undefined) {
          var key = $this.getElementKey(this);
          if(key === undefined) {
            return;
          }
          if(elem.hasClass('isNumber')) {
            value = parseInt(value, null);
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

// http://stackoverflow.com/questions/1038746/equivalent-of-string-format-in-jquery/2648463#2648463
String.prototype.format = String.prototype.f = function() {
  var s = this,
      i = arguments.length;
  while (i--) {
      s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
  }
  return s;
};