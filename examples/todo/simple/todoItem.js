var Note = function Note(notebook, value, isComplete, id) {
  var id = (id === undefined || id === null ? notebook.Get('notes').Size() : id);
  return $('#list-template').ModelView({
    model: {
      id: id,
      isComplete: isComplete,
      note: value
    },
    settings: {
      change: function(event, name, value, object) {
        object.setIsDone();
        notebook.updateUI();
      },
      keyup: function(event, name, value, object) {
        if(MVC.KeyCheck(event, 'enter')) {
          object.toggleMode();
        }
      },
      blur: function(event, name, value, object) {
        object.Find(':input[name="note"]').hide();
        object.Find('#note').show();
      },
      clone: {
          id: '#liNoteElem' + id,
          withDataAndEvents: false,
          append: function(elem) {
            $(elem).prependTo('#note-list').slideDown(400);
          }
      }
    },
    methods: {
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
        // Don't toggle modes if the note is done
        if(!self.getIsDone()) {
          self.Find('#note').toggle(500);
          self.Find(':input[name="note"]').toggle(500, function(){
            $(this).focus();
          });
        }
      },
      init : function(object) {
        var self = object;
        self.Find('#note').click(function() {
          self.toggleMode();
        });
      }
    }
  });
}