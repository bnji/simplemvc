var Note = function Note(notebook, value, isComplete, id) {
  var model = { // Todo Note Model
    id: (id === undefined || id === null ? Date.now() : id),
    isComplete: isComplete,
    note: value
  };
  var methods = { // Todo Note Implementation (methods)
    getIsDone : function() { return this.Get('isComplete'); },
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
    showData : function(event, object) {
      alert(JSON.stringify(object.GetModelData(), null, 2));
    },
    toggleMode : function() {
      var self = this;
      if(!self.getIsDone()) { //Don't toggle modes if the note is done
        self.Find('#note').toggle(500);
        self.Find(':input[name="note"]').toggle(500, function(){
          $(this).focus();
        });
      }
    },
    init : function(object) { // Simple MVC built-in initalize method which runs after 1 ms
      var self = object;
      self.Find('#note').click(function() {
        self.toggleMode();
      });
    }
  };
  var settings = {
    change: function(event, name, value, object) {
      object.setIsDone();
      notebook.updateUI(); // refactor
    },
    keyup: function(event, name, value, object) {
      if(MVC.KeyCheck(event, 'enter')) {
        object.toggleMode(); //Toggle to view mode again
      }
    },
    blur: function(event, name, value, object) {
      object.Find(':input[name="note"]').hide();
      object.Find('#note').show();
    },
    clone: {
        id: '#liNoteElem'+Date.now(),
        withDataAndEvents: false,
        append: function(elem) {
          $(elem).prependTo('#note-list').slideDown(400);
        }
    }
  };
  return $('#list-template').ModelView(model, settings, methods);
}