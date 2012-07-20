//http://localhost/minify/min/?f=simplemvc/simple.mvc.js

/**
 * 
 */
var MVC = {
  Controller : function(data) {
    return data;
  }, 
  ModelView : function(viewId, $object, $settings) { //, onSubmit) {
    console.log("Create()");
    //Always have these settings even not specified
    if($settings === null || $settings === undefined) {
      //alert("settings is null for view: " + viewId);
      $settings = {
        viewId: viewId,
        reflectModelChangeInView: true
      };
    } else {
      $.extend($settings,{viewId: viewId});
    }
    //alert(JSON.stringify($settings, null, 2));
    
    //If changes within the model should be reflected in the view:
    //Loop throught the properties within the object and attach events using
    //jQuery bind and whenever the user wants to update a value it can be done
    //using trigger, which is implemented in the Update method.
    if($settings['reflectModelChangeInView']) { //$object['settings']['reflectModelChangeInView']) {
      $.each($object, function(property,v) {
        
        MVC.AddGetSet($object, property, function(n, ov, nv) {
          
          //Update the view accordingly
          //alert(n + ": " + ov + "=>" + nv);
          $(viewId).getSetHtml($object);
          //Make sure that the input will have the change event triggered,
          //so that the views bound to this element will also be updated.
          //This is important in case the model is changed using setTimeout()
          //which will update the model, then this change must simulate
          //a user setting the value of the input. 
          $(':input[name='+n+']').not('.excludeFromModel').trigger('change');
        });
      });
    }
    //Set the DOM values from the Model
    $(viewId).getSetHtml($object);
    //Initialize the view with the model data if they aren't specified in the model
    MVC.SetModelFromDomValues(viewId, $object); //(?)
    
    //var n, v;
    //Update the model view, whenever a change occurs
    $(viewId+' :input').not('.excludeFromModel').focus(function(){
      console.log('onFocus');
      //http://jsfiddle.net/PKVVP/
      var n = $(this).attr('name');
      var v = MVC.GetDomVal(viewId)[n]; //$(viewId).getSetHtml()[n];
      console.log(n + " : " + v);
      if($settings['settings']['onFocus'] !== undefined && $settings['settings']['onFocus'] !== null) {
        $settings['settings']['onFocus'](n, v);
      }
      //alert(n + " : " + v);
    }).blur(function() {
      console.log('onBlur');
      var n = $(this).attr('name');
      var v = MVC.GetDomVal(viewId)[n]; //$(viewId).getSetHtml()[n];
      console.log(n + " : " + v);      
    }).change(function(){
      console.log('onChange');
      var n = $(this).attr('name');
      var v = MVC.GetDomVal(viewId)[n]; //$(viewId).getSetHtml()[n];
      console.log(n + " : " + v);
      //Update the model and update databound elements too
      MVC.SetModelFromDomValues(viewId, $object);
      if($settings['settings']['onChange'] !== undefined && $settings['settings']['onChange'] !== null) {
        //$settings['onChange']();
        $settings['settings']['onChange'](n, v);
      }
    }).select(function() {
      console.log('onSelect');
      var n = $(this).attr('name');
      var v = $(this).val();// MVC.GetDomVal(viewId)[n]; //$(viewId).getSetHtml()[n];
      console.log(n + " : " + v);
      
    }).submit(function(){
      alert('submit');
    });/*.keyup(function(){
      var n = $(this).attr('name');
      var v = $(this).val();
      MVC.SetDataboundDomVal(viewId, n, v);
    });*/
   
    

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
  Save : function(obj, par) {
    var s = obj['settings']['controller']['Save'];
    if(s !== undefined && s !== null) {
      s(obj, par);
    } else {
      alert('missing save func.');
    }
  },
  Update : function(obj, par) {
    var s = obj['settings']['controller']['Update'];
    if(s !== undefined && s !== null) {
      s(obj, par);
    } else {
      alert('missing update func.');
    }
  },
  Delete : function(obj, par) {
    var s = obj['settings']['controller']['Delete'];
    if(s !== undefined && s !== null) {
      s(obj, par);
    } else {
      alert('missing save func.');
    }
  },
  //Use whenever you need to update a models value and reflect in the DOM 
  Set : function(obj, key, val) {
    $(obj).trigger('set'+Common.FirstCharToUpper(key), [val]);
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
    var result = {val : 0};
    $(obj).triggerHandler('get'+Common.FirstCharToUpper(key), [result]);
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
    (function($object, thisProp) {
      var propFstCap = Common.FirstCharToUpper(thisProp);
      $($object).bind('get'+propFstCap, function(event, ret) {
        ret['val'] = $object[thisProp];
      }).bind('set'+propFstCap, function (event, newVal) {
        //Replace the old value with the new value in the model
        var oldVal = $object[thisProp];
        $object[thisProp] = newVal;
        onUpdate(thisProp, oldVal, newVal);
      });    
    })(obj, prop);
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
    $.each(pars, function(key, val) { 
      $object[key] = val;
      //alert(key + " = " + val);
      MVC.SetDataboundDomVal(viewId, key, val);
    });
    //Return the values in JSON format
    return pars;
  },
  /**
   * Update the databound elements!
   */
  SetDataboundDomVal : function(datasrc, name, value) {
    console.log("SetDataboundDomVal()");
    //alert(datasrc + " " + name + " " + value);
    //alert($(document).find('[datasrc='+datasrc+'][name='+name+']').html());
    //$(document).find('[datasrc='+datasrc+'][name='+name+']').html(value).val(value);
    //$('*').find('[datasrc='+datasrc+'][name='+name+']').html(value).val(value);
    //$('[datasrc='+datasrc+'][name='+name+']').text(value).val(value);
    $('div[datasrc|='+datasrc+'][name|='+name+'],p[datasrc|='+datasrc+'][name|='+name+'],span[datasrc|='+datasrc+'][name|='+name+']').text(value);
    $('input[datasrc|='+datasrc+'][name|='+name+']').val(value);
  }
};

var Common = {
  FirstCharToUpper : function(input) {
    return input.substring(0, 1).toUpperCase() + input.substring(1, input.length);
  }
};

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
    getDivElements : function(target) {
      var selItems =  target.find('p,span,div').filter(':not(.excludeFromModel)');
      //console.log(selItems);
      return selItems;
    },
    setValues : function(params) {
      console.log('setValues called!');
      //Set the values for  'p', 'div' and 'span' elements
      this.getDivElements(this).each(function() {
        var key = $(this).attr('datafld');
        if(key === undefined) {
          key = $(this).attr('id');
        }
        if(key === undefined) {
          return;
        }
        var val = params[key];
        $(this).html(val);
        //var toReplace = $.trim($(this).text());
        //alert(toReplace);
      });
      
      this.getInputElements(this).each(function(){
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
      this.getInputElements(this).each(function() {
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
      //alert(JSON.stringify(formData, null, 2));
      
      this.getDivElements(this).each(function() {
        var value = $(this).html();
        //alert(value);
        if(value !== undefined) {
          
          var key = $(this).attr('datafld');
          if(key === undefined) {
            key = $(this).attr('id');
          }
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