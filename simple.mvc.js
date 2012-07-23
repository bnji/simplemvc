// ==========================================================================
// Project:   Simple JavaScript MVC / MVVM
// Copyright: ©2012 Benjamin Hammer (hammerbenjamin@gmail.com)
// License:   Licensed under MIT license (see LICENCE.MD)
// To minify: http://localhost/minify/min/?f=simplemvc/simple.mvc.js
// ==========================================================================
//var counter = 0;
/**
 * Helper functions (helps reduce code base)
 */
var CMN = {
  /**
   * 
   * @param {String} input
   * @return The input string, but with the first char in upper case
   */
  /*FstChrUp : function(input) {
    return input.substring(0, 1).toUpperCase() + input.substring(1, input.length);
  }*/
  LOG : function(data) {
    console.log(data);
  },
  JSTR : function(o) {
    return CMN.JSTR(o, null, 2);
  }
};
/**
 * Provides the core MVC classes: Controller & ModelView 
 * @module MVC
 * @main MVC
 */
var MVC = {
  /**
   * Controller which handles the logic, such as saving, updating or deleting
   * the object.
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
    //CMN.LOG("ModelView Created...");
    
    //Make sure that there always is object data. Only require 'viewId'
    if($object === null || $object === undefined) {
      $object = {};
    }
    
    //Always have the following settings even not specified (null or undefined)
    if($settings === null || $settings === undefined) {
      $settings = {};
    }
    if($settings['viewId'] === undefined) {
      $.extend($settings, {viewId : viewId});
    }
    if($settings['reflectModelChangeInView'] === undefined) {
      $.extend($settings, {reflectModelChangeInView : true});
    }
    //alert(CMN.JSTR($settings));
    
    //Start: Methods
    
    /**
     * Call the .Save() method whenever you want to save the object.
     * Notice: This is intended behaviour, but the implementation of the
     * method is up to the individual how and what is done when this method
     * is called/executed.
     * 
     * @method Save
     * @param {Object} par Provide extra parameters if needed. 
     */
    $object.Save = function(par) {
      $object.ExecuteController('Save', par);
    }
    /**
     * Call the .Update() method whenever you want to update the object.
     * Notice: This is intended behaviour, but the implementation of the
     * method is up to the individual how and what is done when this method
     * is called/executed.
     * 
     * @method Update
     * @param {Object} par Provide extra parameters if needed. 
     */
    $object.Update = function(par) {
      $object.ExecuteController('Update', par);
    }
    /**
     * Call the .Delete() method whenever you want to delete the object.
     * Notice: This is intended behaviour, but the implementation of the
     * method is up to the individual how and what is done when this method
     * is called/executed.
     * 
     * @method Delete
     * @param {Object} par Provide extra parameters if needed. 
     */
    $object.Delete = function(par) {
      $object.ExecuteController('Delete', par);
    }
    
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
     */
    $object.AddGetSet = function(prop, onUpdate) {
      //CMN.LOG("AddGetSet");
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
          onUpdate(prop, oldVal, newVal);
        }
      });
    }
    
    /**
     * RemoveGetSet
     * 
     * Remove getter and setter methods for a property
     * 
     * @method RemoveGetSet
     * @param {String} prop The object's property name 
     */
    $object.RemoveGetSet = function(prop) {
      $($object)
      .unbind('get'+prop)
      .unbind('set'+prop);
    }
    
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
     * 
     */
    $object.Set = function(prop, value) {
      //CMN.LOG("Set()");
      //$(obj).trigger('set'+Common.FstChrUp(key), [val]);
      $($object).triggerHandler('set'+prop, [value]);
    }
    /**
     * Get
     * 
     * Notice: Must only be used if 'reflectModelChangeInView' is TRUE.
     * 
     * @method Get
     * @param {String} prop The object's property name
     * @return {Object} value The value from the object's property 
     */
    $object.Get = function(prop) {
      //http://stackoverflow.com/questions/9145347/jquery-returning-value-from-trigger
      //CMN.LOG("Get()");
      var result = { value : undefined };
      //$($object).triggerHandler('get'+Common.FstChrUp(key), [result]);
      $($object).triggerHandler('get'+prop, [result]);
      return result['value'];
    }
    
    /**
     * SetViewFromModel
     * 
     * Updates the elements in the View from the Model.
     * 
     * @method SetViewFromModel
     */
    $object.SetViewFromModel = function() {
      //CMN.LOG("SetViewFromModel()");
      //Set the values in the DOM
      $(viewId).getSetHtml($object);
    }
    
    /**
     * GetViewData
     * 
     * Return the View data as an JSON object literal.
     * 
     * @method GetViewData
     * @return {Object} The View data as JSON object
     */
    $object.GetViewData = function() {
      //CMN.LOG("GetViewData()");
      //Get the values from the View (DOM)
      return $(viewId).getSetHtml();
    }
    
    /**
     * SetModelFromView
     * 
     * Update the model and databound elements
     * 
     * @method SetModelFromView
     * @param {Boolean} updateDataboundValues TRUE | FALSE - If undefined or 
     * true, databound elements inside and/or outside the the View will also 
     * get updated. If false, then they won't. 
     */
    $object.SetModelFromView = function(updateDataboundValues) {
      //CMN.LOG("SetModelFromView()");
      //Get the values from the DOM
      //var pars = MVC.GetViewData(viewId);
      var pars = $object.GetViewData();
      //alert(MVC.CMN.JSTR(pars));
      //alert(CMN.JSTR($formParams, null, 2));
      //Update the model using the DOM values
      $.each(pars, function(key, newVal) {
        var oldVal = $object[key];
        //Only update values if they're changed
        //alert(typeof oldVal + " " + oldVal);
        //alert((typeof oldVal) + " - " + (typeof oldVal) == 'String');
        //Check the value of oldVal (not newVal)
        //See why when checking valType === 'undefined' below
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
            if(updateDataboundValues === undefined || updateDataboundValues === true) {
              //Update databound DOM values 
              $object.SetDataboundDomVal(viewId, key, newVal);
            }
            
          //}
          //else {
          //  alert("Missing implementation of primitive types in SetModelFromView() method for type: " + valType);
          //}
        }
      });
      //Return the values in JSON format
      return pars;
    }
    
    /**
     * SetDataboundDomVal
     * 
     * Update the databound elements inside or outside the View.
     * 
     * @method SetDataboundDomVal
     * @param {String} datasrc A viewId.
     * @param {String} name An element's name.
     * @param {String} value A new value.
     */
    $object.SetDataboundDomVal = function(datasrc, name, value) {
      //CMN.LOG("SetDataboundDomVal()");
      //The following works fine, except it breaks in IE<9!!!
      //$('[datasrc='+datasrc+'][name='+name+']').text(value).val(value);
      //This works though:
      //CMN.LOG(counter + " - datasrc: " + datasrc + " - name: " + name + " - value: " + value);
      $('div[datasrc|='+datasrc+'][name|='+name+'],p[datasrc|='+datasrc+'][name|='+name+'],span[datasrc|='+datasrc+'][name|='+name+']').text(value);
      $('input[datasrc|='+datasrc+'][name|='+name+']').val(value);
      //counter++;
    }
    
    /**
     * RunEvent
     * 
     * Trigger an event if specified in the settings.
     * 
     * @method RunEvent
     * @param {String} event The eventName to trigger/execute.
     */
    $object.RunEvent = function(event) {
      //alert(event.target.name);
      var type = event.type;
      if(type === undefined) {
        type = event;
      }
      if(event === undefined) {
        //CMN.LOG('event "e" is undefined!');
        return;
      }
      if($.trim(event.target.name).length > 0) {
        if($settings['settings'][type] !== undefined && $settings['settings'][type] !== null) {
          $settings['settings'][type](event, event.target.name, event.target.value);
        }
      } else {
        CMN.LOG("source element has no name attribute assigned (required!)");
      }
    }
    
    /**
     * ExecuteController
     * 
     * Execute a method in the controller.
     * 
     * @method ExecuteController
     * @param {String} method The methods name specified in the controller.
     * @param {Object} par If needed you can provide optional parameters.
     */
    $object.ExecuteController = function(method, par) {
      var exec = $object['settings']['controller'][method];
      if(exec !== undefined && exec !== null) {
        exec($object, par);
      } else {
        CMN.LOG('Missing ' + method + '() method!');
      }
    }
    
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
    }
    
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
      //Loop throught the object's properties
      $.each($object, function(k,v) {
        //alert(k + " : " + v);
        //var pars = MVC.GetViewData(viewId);
        //Add the Getter and Setter methods
        //n: name, ov: old value, nv: new value
        //MVC.AddGetSet($object, k, function(n, ov, nv) {
        $object.AddGetSet(k, function(n, ov, nv) {
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
        });
      });
    }
    /*
    var clone = $settings['clone'];
    if(clone !== undefined) {
      var newViewId = clone['id'];
      //Clone the source
      var element = $(viewId).clone();
      //CMN.LOG('element old id: #' + element.attr('id'));
      var $copy = $(element).attr('id', newViewId);
      //CMN.LOG('element new id: #' + element.attr('id'));
      //CMN.LOG($copy.html());
      var newId = $.now();
      var elem = $('span,p,div,input');
      CMN.LOG('name: ' + elem.attr('name'));
      elem.attr('name', name + "_" + newId);//.attr('id', newId);
      CMN.LOG($copy.html());
      //If the template originally was hidden using 'display: none;' - make it visible to the user
      $copy.show();
      //Append the copy to the target
      $(clone['target']).append($copy);
    }
    */
    if($settings['autoSaveInterval'] > 0) {
      setInterval(function() { 
        $object.Save();
      }, $settings['autoSaveInterval']);
    }
    
    //Update the model view, whenever a change occurs
    $(viewId+' :input')
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
    .keyup(function(e){
      //If the 'keyup' event hasn't been specified in the settings, then
      //by default update the Model and databound values using the
      //SetModelFromView() method
      if($settings['settings']['keyup'] === undefined) {
        //MVC.SetModelFromView(viewId, $object);
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
    });

    //Add the settings to the Model object
    $settings = { settings : $settings };
    $.extend($object, $settings);
    return $object;
  }
};

/**
 * Get or set HTML (DOM) values
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
      var selItems = target.find('input,select,textarea').filter(':not(.excludeFromModel)');
      //CMN.LOG(selItems);
      return selItems;
    },
    getElementKey : function(element) {
      var key = $(element).attr("datafld");
      if(key === undefined) {
        key = $(element).attr("id");
      }
      return key;
    },
    getDivElements : function(target) {
      var selItems =  target.find('p,span,div').filter(':not(.excludeFromModel)');
      //CMN.LOG(selItems);
      return selItems;
    },
    
    setValues : function(params) {
      CMN.LOG('setValues called!');
      //CMN.LOG(this.getDivElements(this));
      //Set the values for  'p', 'div' and 'span' elements
      $this = this;
      $this.getDivElements(this).each(function() {
        var key = $this.getElementKey(this);
        if(key === undefined) {
          return;
        }
        //alert(key);
        var value = params[key];
        //alert(key + " = " + value);
        CMN.LOG(value);
        $(this).text(value);
        //var toReplace = $.trim($(this).text());
        //alert(toReplace);
      });
      
      $this.getInputElements(this).each(function(){
        var value = params[ $(this).attr("name") ], $this;
        // Don't do all this work if there's no value
        if ( value !== undefined) {
          $this = $(this);
          
          // Nested these if statements for performance
          if ( $this.is(":radio") ) {
            if ( $this.val() === value ) {
              //alert(value);
              $this.attr("checked", true);
              //value = $this.val();
            }
          } else if ( $this.is(":checkbox") ) {
            // Convert single value to an array to reduce
            // complexity
            value = $.isArray( value ) ? value : [value];
            if ( $.inArray( $this.val(), value ) > -1) {
              $this.attr("checked", true);
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
      $this = this;
      $this.getInputElements(this).each(function() {
        var elm = $(this);
        var type = elm.attr('type'),
            name = elm.attr('name'),
            value = elm.val();
        if(type === 'submit' || !name) {
          return;
        }
        
        //CMN.LOG("type: " + type + " - name: " + name + " - value: " + value);
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
        //alert(value);
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
      data = $.extend(data, formData);
      //alert(CMN.JSTR(data, null, 2));
      return data;
    }
  });
})(jQuery);