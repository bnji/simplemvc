// ==========================================================================
// Project:   Simple JavaScript MVC / MVVM
// Copyright: ©2012 Benjamin Hammer (hammerbenjamin@gmail.com)
// License:   Licensed under MIT license (see LICENCE.MD)
// To minify: http://localhost/minify/min/?f=simplemvc/simple.mvc.js
// ==========================================================================
var Common = {
  /**
   * 
   * @param {String} input
   * @return The input string, but with the first char in upper case
   */
  /*FstChrUp : function(input) {
    return input.substring(0, 1).toUpperCase() + input.substring(1, input.length);
  }*/
};
/**
 * 
 */
var MVC = {
  Controller : function(data) {
    return data;
  }, 
  ModelView : function(viewId, $object, $settings) { //, onSubmit) {
    console.log("ModelView Created...");
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
    //alert(JSON.stringify($settings, null, 2));
    
    //If changes within the model should be reflected in the view:
    //Loop throught the properties within the object and attach events using
    //jQuery bind and whenever the user wants to update a value it can be done
    //using trigger, which is implemented in the Update method.
    if($settings['reflectModelChangeInView']) { //$object['settings']['reflectModelChangeInView']) {
      $.each($object, function(k,v) {
        MVC.AddGetSet($object, k, function(n, ov, nv) {
          //Update the view accordingly
          //alert(n + ": " + ov + "=>" + nv);
          MVC.SetDomVal(viewId, $object); //$(viewId).getSetHtml($object);
          //Make sure that the input will have the change event triggered,
          //so that the views bound to this element will also be updated.
          //This is important in case the model is changed using setTimeout()
          //which will update the model, then this change must simulate
          //a user setting the value of the input. 
          $(':input[name='+n+']').not('.excludeFromModel').trigger('change');
        });
      });
    }
    
    var autoSaveInterval = $settings['autoSaveInterval'];
    if(autoSaveInterval > 0) {
      setInterval(function() { MVC.Save($object); }, autoSaveInterval);
    }
    
    //Set the DOM values from the Model
    MVC.SetDomVal(viewId, $object); //$(viewId).getSetHtml($object);
    //Initialize the view with the model data if they aren't specified in the model
    MVC.SetModelFromDomValues(viewId, $object); //(?)
    
    //Update the model view, whenever a change occurs
    $(viewId+' :input').not('.excludeFromModel')
    .focus(function(e){
      //http://jsfiddle.net/PKVVP/
      MVC.EvtRun($settings, e);
    })
    .blur(function(e) {
      MVC.EvtRun($settings, e);      
    })
    .change(function(e){
      //Update the model and also the databound elements
      MVC.SetModelFromDomValues(viewId, $object); //Always do this (core concept!)
      MVC.EvtRun($settings, e);
    })
    .select(function(e) {
      MVC.EvtRun($settings, e);
    })
    .submit(function(e){
      MVC.EvtRun($settings, e);
    })
    .keyup(function(e){
      MVC.EvtRun($settings, e);
      /*var n = $(this).attr('name');
      var v = $(this).val();
      MVC.SetDataboundDomVal(viewId, n, v);*/
    })
    .keypress(function(e) {
      MVC.EvtRun($settings, e);
    })
    .keydown(function(e) {
      MVC.EvtRun($settings, e);
    });
   
    

    //Add the settings to the Model object
    $settings = {settings:$settings};
    //alert(JSON.stringify($object, null, 2));
    $.extend($object, $settings);
    //alert(viewId + ": " + JSON.stringify($settings, null, 2));
    //alert(JSON.stringify($object, null, 2));
    //Return the new object in JSON format
    //alert(JSON.stringify($object, null, 2));
    return $object;
  },
  EvtRun : function(settings, event) {
    var type = event.type;
    if(settings['settings'][type] !== undefined && settings['settings'][type] !== null) {
      settings['settings'][type](event, event.target.name, event.target.value);
    }
  },
  CtrRun : function(methodName, obj, par) {
    var exec = obj['settings']['controller'][methodName];
    if(exec !== undefined && exec !== null) {
      exec(obj, par);
    } else {
      alert('Missing ' + methodName + '() method!');
    }
  },
  Save : function(obj, par) {
    MVC.CtrRun('Save', obj, par);
  },
  Update : function(obj, par) {
    MVC.CtrRun('Update', obj, par);
  },
  Delete : function(obj, par) {
    MVC.CtrRun('Delete', obj, par);
  },
  //Use whenever you need to update a models value and reflect in the DOM 
  Set : function(obj, key, val) {
    //$(obj).trigger('set'+Common.FstChrUp(key), [val]);
    $(obj).trigger('set'+key, [val]);
    console.log("Set)");
  },
  /**
   * Must only be used if 'reflectModelChangeInView' is TRUE.
   * 
   * @param obj The data object literal (JSON)
   * @param key The property key
   * @return The value from 
   */
  Get : function(obj, key) {
    //http://stackoverflow.com/questions/9145347/jquery-returning-value-from-trigger
    console.log("Get()");
    var result = {val : undefined};
    //$(obj).triggerHandler('get'+Common.FstChrUp(key), [result]);
    $(obj).triggerHandler('get'+key, [result]);
    return result['val'];
  },
  /**
   * AddGetSet: Add getters and setters
   * 
   * Getters and Setters in JavaScript/JScript (ECMAScript) are not an option
   * as it is hard to get workin cross-browser/platform!
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
   * @param obj The data object literal (JSON) 
   * @param prop The property name
   * @param onUpdate callBack function will execute, whenever the get/set 
   * event handlers bound with .bind() method.
   */
  AddGetSet : function(obj, prop, onUpdate) {
    console.log("AddGetSet");
    //var thisProp = Common.FstChrUp(thisProp);
    $(obj).bind('get'+prop, function(event, ret) {
      ret['val'] = obj[prop];
    }).bind('set'+prop, function (event, newVal) {
      //Replace the old value with the new value in the model
      var oldVal = obj[prop];
      //Only update values if they're changed
      if(oldVal !== newVal) {
        obj[prop] = newVal;
        onUpdate(prop, oldVal, newVal);
      }
    });
  },
  SetDomVal : function(viewId, data) {
    console.log("SetDomVal()");
    //Set the values in the DOM
    $(viewId).getSetHtml(data);
  },
  GetDomVal : function(viewId) {
    console.log("GetDomVal()");
    //Get the values from the DOM
    return $(viewId).getSetHtml();
  },
  //Get DOM values and update the model
  SetModelFromDomValues : function(viewId, $object) {
    console.log("SetModelFromDomValues()");
    //Get the values from the DOM
    var pars = MVC.GetDomVal(viewId);
    //alert(JSON.stringify($formParams, null, 2));
    //Update the model using the DOM values
    $.each(pars, function(key, newVal) {
      var oldVal = $object[key];
      //Only update values if they're changed
      if(oldVal !== newVal) {
        //alert(key + ": " + oldVal + " changed to " + newVal);
        //Update the model with the value from DOM
        $object[key] = newVal;
        //Only update databound DOM values which 
        MVC.SetDataboundDomVal(viewId, key, newVal);
      }
    });
    //Return the values in JSON format
    return pars;
  },
  /**
   * Update the databound elements!
   * 
   * @param {Object} datasrc
   * @param {Object} name
   * @param {Object} value
   */
  SetDataboundDomVal : function(datasrc, name, value) {
    console.log("SetDataboundDomVal()");
    //The following works fine, except it breaks in IE<9!!!
    //$('[datasrc='+datasrc+'][name='+name+']').text(value).val(value);
    //This works though:
    $('div[datasrc|='+datasrc+'][name|='+name+'],p[datasrc|='+datasrc+'][name|='+name+'],span[datasrc|='+datasrc+'][name|='+name+']').text(value);
    $('input[datasrc|='+datasrc+'][name|='+name+']').val(value);
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
      var selItems = target.find('input,button,select,textarea').filter(':not(.excludeFromModel)');
      //console.log(selItems);
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
      //console.log(selItems);
      return selItems;
    },
    
    setValues : function(params) {
      console.log('setValues called!');
      //console.log(this.getDivElements(this));
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
        console.log(value);
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
        
        if(elm.hasClass('isNumber')) {
          value = parseInt(value);
        } 
        
        if(elm.is(':checkbox')) {
          value = false;
          if(elm.attr('checked')) {
            value = true;
          }
          formData[name] = value;
          //alert(name + " = " + value);
        }
        else if(elm.is(':radio')) {
          if(elm.attr('checked')) {
            //do what with this?
            formData[name] = value;
            //alert(name + " = " + value);
          }
        }
        else {
          formData[name] = value;
        }
      });
      
      $this.getDivElements(this).each(function() {
        var value = $(this).text();
        //alert(value);
        if(value !== undefined) {
          
          var key = $this.getElementKey(this);
          if(key === undefined) {
            return;
          }
          //alert(key + " = " + value);
          data[key] = value;
        }
      });
      data = $.extend(data, formData);
      //alert(JSON.stringify(data, null, 2));
      return data;
    }
  });
})(jQuery);