// ==========================================================================
// Project:   Simple JavaScript MVC / MVVM
// Copyright: ©2012 Benjamin Hammer (hammerbenjamin@gmail.com)
// License:   Licensed under MIT license (see LICENCE.MD)
// To minify: http://localhost/minify/min/?f=simplemvc/simple.mvc.js
// ==========================================================================
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
    
    //$object = {};
    
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
      //Clone the source
      var element = $($(clone['template'])
                    .clone(clone['withDataAndEvents']))
                    .attr('id', viewIdNoHash);
      
      //Update the datasrc with the new view id
      $(element)
      .find('[datasrc]')
      .attr('datasrc', viewId);
      //Attach events to the save, update, delete (more?) buttons/submit.
      $(element).find('button,:submit').each(function(i, e) {
        $(this).attr('id', e.id+'_'+viewIdNoHash)
        .bind('click', function(e) {
          //$object.ExecuteController($id, par);
          //$object.Save();
          $object.ExecuteController(e.target.name);
        });
        console.log(i + " " + e.id);
      });
      //If the template originally was hidden using 'display: none;' - make it visible to the user
      element.show();
      //Append the copy to the target
      clone['append'](element);
    }
    //alert(viewId);
    
    if($settings['viewId'] === undefined) {
      $.extend($settings, {viewId : viewId});
    }
    if($settings['reflectModelChangeInView'] === undefined) {
      $.extend($settings, {reflectModelChangeInView : true});
    }
    if($settings['eventUsed'] === undefined) {
      $.extend($settings, {eventUsed : ''});
    }
    
    
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
     * Clear
     * 
     * Clears a property's value in the Model and the View.
     * 
     * 
     * @method Clear
     */
    $object.Clear = function(prop) {
      $object.Set(prop, '');
    }
    
    /**
     * Clear All
     * 
     * Clears all the data in the Model and the View.
     * 
     * @method ClearAll
     */
    $object.ClearAll = function() {
      //implement it
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
      //alert("Setting");
      //CMN.LOG("Set()");
      //$(obj).trigger('set'+Common.FstChrUp(key), [val]);
      //$($object).triggerHandler('set'+prop, [value]); ?
      $($object).triggerHandler('set'+prop, [value]);
      //Update databound DOM values 
      $object.SetDataboundDomVal(viewId, prop, value);
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
      //$($object).triggerHandler('get'+prop, [result]); ?
      $($object).triggerHandler('get'+prop, [result]);
      return result['value'];
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
     * SetViewFromModel
     * 
     * Updates the elements in the View from the Model.
     * 
     * @method SetViewFromModel
     */
    $object.SetViewFromModel = function() {
      //CMN.LOG("SetViewFromModel()");
      //Set the values in the DOM
      //alert(JSON.stringify($object));
      $(viewId).getSetHtml($object);
    }
    
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
     */
     //$object.SetModelFromView = function(updateDataboundValues) {
     $object.SetModelFromView = function() {
      //CMN.LOG("SetModelFromView()");
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
      return data;
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
          $settings['settings']['eventUsed'] = type;
          console.log(type);
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
        exec($object, par); //?
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
      //alert("reflect on");
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
    
    if($settings['autoSaveInterval'] > 0) {
      $settings['eventUsed'] = '"autoSave"';
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
    });

    //Add the settings to the Model object
    $settings = { settings : $settings };
    //$.extend($object, $settings);
    //Add the data to the Model object
    //$data = { data : $data };
    $.extend($object, $settings);
    //alert(JSON.stringify($object, null, 2));
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
      //CMN.LOG('setValues called!');
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
        //CMN.LOG(value);
        $(this).text(value);
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
      //alert(CMN.JSTR(data, null, 2));
      return data;
    }
  });
})(jQuery);