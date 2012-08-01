$(function() {
  var objModel, objMethods, objConfig, obj; //Declare the variables here...
  
  objModel = { //The model (is kinda like a Class => Object (data)). To retrieve this later call: obj.GetModelData();
    name: 'John Doe',
    info: 'Is dead...'
  };
  
  objMethods = { //The methods (which enable us to manipulate the object (model) and view)
    init : function() { //Init is executed 1ms after 'obj' is created.
      obj.updatePreview(); //Put other 'generic' jQuery here for cleaner code.
    },
    updatePreview : function() { //Finds an element inside the View & Triggers a keyup event to initialize the preview
      obj.Find('.previewData').html(obj.Get('name') + " - " + obj.Get('info'));
    } //Implement any extra methods below...
  };
  
  objConfig = { //The model's config/settings
    controller: MVC.Controller({ //A controller with Save & Clear methods
      Save : function(e) { //Notice that name='Save' is bound to this method
        alert(JSON.stringify(obj.GetModelData(), null, 2));
      },
      Clear : function(e) { //Guess how this is connected to the view...
        obj.ClearAll().updatePreview(); //Clear all the input fields & Update the preview (should have no data now)
      } //e.preventDefault() is automaticly called. To override: Add 'preventDefault: false' to the settings 'objConfig' (without '').
    }),
    clone: { //Use 'clone' whenever you are cloning a template
        id: '#'+$.now(), //Give the new clone an id. '#template' becomes this new ID.
        append: function(elem) { //Where to 'append' this new clone?
            $('#simpleMvcView').html(elem); //Replace data in '#simpleMvcView' with the clone
            $(elem).show(); //Make the clone visible
        }
    },
    keyup : function(e, n, v) { //Listen for keyup events...
      obj.SetModelFromView().updatePreview(); //<-- Important method call: .SetModelFromView()
    } //Implement any other event handlers for the input fields here...
  };
  
  obj = MVC.ModelView('#template', objModel, objConfig, objMethods); //Do something with the object 'obj'...
});