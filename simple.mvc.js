//http://localhost/minify/min/?f=simplemvc/simple.mvc.js
var ViewModel = {
  //Use whenever you need to update a models value and reflect in the DOM 
  Update : function(obj, key, val) {    
    $(obj).trigger('set'+Common.FirstCharToUpper(key), [val]);
  },
  Create : function(viewId, $object, reflectModelChangeInView, onChange) { //, onSubmit) {
    //If changes within the model should be reflected in the view:
    //Loop throught the properties within the object and attach events using
    //jQuery bind and whenever the user wants to update a value it can be done
    //using trigger, which is implemented in the Update method.
    if(reflectModelChangeInView) {
      $.each($object, function(property,v) {
        ViewModel.AttachGetterSetter($object, property, function(n, ov, nv) {
          //Update the view accordingly
          $(viewId).getSetHtml($object);
          //Make sure that the input will have the change event triggered,
          //so that the views bound to this element will also be updated.
          $(':input[name='+n+']').not('.excludeFromModel').trigger('change');
        });
      });
    }
    //Set the DOM values
    $(viewId).getSetHtml($object);
    //Initialize the view with the model data
    ViewModel.GetDomVal(viewId, $object);
    //Update the model view, whenever a change occurs
    $(viewId+' :input').not('.excludeFromModel').change(function(){
      //Update the model
      ViewModel.GetDomVal(viewId, $object);
      var n = $(this).attr('name');
      var v = $(viewId).getSetHtml()[n];
      //ViewModel.SetDomVal(viewId, n, v);
      //$(viewId).getSetHtml($object);
      if(onChange !== undefined && onChange !== null) {
        onChange();
      }
    }).keyup(function(){
      var n = $(this).attr('name');
      var v = $(this).val();
      ViewModel.SetDomVal(viewId, n, v);
    });
    //Return the new object in JSON format
    //alert($object);
    return $object;
  },
  AttachGetterSetter : function(obj, prop, onUpdate) {
    (function($object, thisProp) {
      var propFstCap = Common.FirstCharToUpper(thisProp);
      $($object).bind('get'+propFstCap, function () { return $object[thisProp]; } );
      $($object).bind('set'+propFstCap, function (event, newVal) {
        //Replace the old value with the new value in the model
        var oldVal = $object[thisProp];
        $object[thisProp] = newVal;
        onUpdate(thisProp, oldVal, newVal);
      });    
    })(obj, prop);
  },
  //Get DOM values and update the model
  GetDomVal : function(viewId, $object) {
    //Get the values from the DOM
    var pars = $(viewId).getSetHtml();
    //alert(JSON.stringify($formParams, null, 2));
    //Update the model using the DOM values
    $.each(pars, function(key, val) { 
      $object[key] = val;
      //alert(key + " = " + val);
      ViewModel.SetDomVal(viewId, key, val);
    });
    //Return the values in JSON format
    return pars;
  },
  SetDomVal : function(datasrc, name, value) {
    //alert(datasrc + " " + name + " " + value);
    //alert($(document).find('[datasrc='+datasrc+'][name='+name+']').html());
    //$(document).find('[datasrc='+datasrc+'][name='+name+']').not('.excludeFromModel').html(value);
    $(document).find('[datasrc='+datasrc+'][name='+name+']').html(value).val(value);
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
      var selItems = target.find('input,button,select').filter(':not(.excludeFromModel)');//.not('.excludeFromModel');
      //console.log(selItems);
      return selItems;
    },
    getDivElements : function(target) {
      var selItems =  target.find('p,span,div').filter(':not(.excludeFromModel)');
      //console.log(selItems);
      return selItems;// target.find('p,span,div').not('.excludeFromModel');
    },
    setValues : function(params) {
      console.log('setValues called!');
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
        //alert();
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
      data = $.extend({}, data, formData);
      //alert(JSON.stringify(data, null, 2));
      return data;
    }
  });
})(jQuery);

/*Using jQuery instead of this
//Source: http://javascriptweblog.wordpress.com/2010/11/15/extending-objects-with-javascript-getters/
function extendAsArray(obj, onSet) {
    if (obj.length === undefined) {// || obj.__lookupGetter__('length')) {
        var index = 0;
        //document.body.appendChild(obj);
        for (var prop in obj) {
          (function(thisIndex, thisProp) {
            var propFstCap = thisProp.substring(0, 1).toUpperCase() + thisProp.substring(1, thisProp.length);
            Object.defineProperty(obj, "gs"+propFstCap, {
              get: function() {
                  return obj[thisProp];
              },
              set: function(newVal) {
                //alert(thisProp + ": " + obj[thisProp] + "=>" + newVal);
                var oldVal = obj[thisProp]; 
                obj[thisProp] = newVal;
                onSet(thisProp, oldVal, newVal);
              }
            });
          })(index, prop)
          index++;
        };
        //obj.__defineGetter__("length", function() {return index});
    }
    return obj;
}*/