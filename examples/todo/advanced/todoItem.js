var Note = function Note(notebook, value, isComplete, id) {
  var id = (id === undefined || id === null ? notebook.Get('notes').Size() : id);
  var templateViewId = '#list-template';
  // Todo Note Model
  var model = {
    id: id, // (id === undefined || id === null ? Date.now() : id),
    isComplete: isComplete,
    note: value
  };
  // Todo Note Implementation (methods)
  var methods = {
    getIsDone : function() {
      return this.Get('isComplete');
    },
    setIsDone : function() {
      var self = this;
      var noteElem = self.Find('#note');
      if(self.getIsDone()) {
        noteElem.addClass('isComplete');
      } else {
        noteElem.removeClass('isComplete');
      }
      return self;
    },
    save : function() {
      var self = this;
      store.save(self.Get('id'), self.GetModelData()); //Store the data
      return self;
    },
    toggleMode : function() {
      var self = this;
      //Don't toggle modes if the note is done
      if(!self.getIsDone()) {
        self
          .Find('#note')
          .toggle(500);
        self
          .Find(':input[name="note"]')
          .toggle(500, function(){
            $(this).focus();
          });
      }
    },
    showData : function(event, object) {
      alert(JSON.stringify(object.GetModelData(), null, 2));
    },
    // Simple MVC built-in initalize method which runs after 1 ms
    init : function(object) {
      var self = object;
      self
        .Find('#note')
        .click(function() {
          self.toggleMode();
        });
    }
  };
  var settings = {
    change: function(event, name, value, object) {
      var self = object;
      self
        .setIsDone()
        .save(); //save the note
      notebook.updateUI(); // refactor
    },
    keyup: function(event, name, value, object) {
      var self = object;
      if(TodoHelper.isValidInput(value)) {
        if(MVC.KeyCheck(event, 'enter')) {
          self.save(); //save the note
          self.toggleMode(); //Toggle to view mode again
        }
        else if(MVC.KeyCheck(event, 'escape')) {
          if(TodoHelper.isValidInput(value)) {
            self
              .Find(':input[name="note"]')
              .blur();
          }
        }
      }
    },
    blur: function(event, name, value, object) {
      object
        .Find(':input[name="note"]')
        .hide();
      object
        .Find('#note')
        .show();
        // .toggleMode();
    },
    clone: {
        id: '#liNoteElem' + id,
        withDataAndEvents: false,
        append: function(elem) {
          $(elem)
            .prependTo('#note-list')
            .slideDown(400);
        }
    }
  };
  //Create and return a new note using Simplemvc
  return $(templateViewId).ModelView(model, settings, methods);
}