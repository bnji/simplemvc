$(function() {
  var model = { // Todo List Model
    name: "Simple MVC - Simple Todo List",
    notes: MVC.List() //Provides helper methods
  };
  var methods = { // Todo List Implementation (methods)
    add : function(value, isComplete) { // Create (add) a new note
      var self = this;
      var note = new Note(self, value, isComplete);
      self.getNotes().Add(note);
      self.updateUI(); //Update databound elements
      return self;
    },
    remove : function(note) { // Remove an existing note
      var self = this;
      if(self.getNotes().Remove(note)) {
        self.updateUI().focusInput();
        $(self).remove();
      }
      return self;
    },
    getNotes : function() {
      return this.Get('notes');
    },
    getNotesDone : function() {
      var self = this;
      var notesDone = MVC.List();
      $.each(self.getNotes(), function(i, note) {
        if(note.Get('isComplete')) {
          notesDone.Add(note);
        }
      });
      return notesDone;
    },
    getNotesCount : function() {
      return this.getNotes().Size();
    },
    getNotesDoneCount : function() {
      return this.getNotesDone().Size();
    },
    clearDone : function(removeAll) {
      var self = this;
      $.each(self.getNotes(), function(k, note) {
        if(removeAll || note.Get('isComplete')) {
          $(note.GetViewId()).slideUp('slow', function() {
            self.remove(note); //Remove the note the Model
          });
        }
      });
      return self;
    },
    clearAll : function() {
      return this.clearDone(true);
    },
    focusInput : function() {
      var self = this;
      self
        .Find('.create')
        .val('')
        .focus();
      return self;
    },
    clear : function() {
      return this.clearAll();
    },
    updateUI : function() {
      var self = this;
      var notesDone = self.getNotesDoneCount();
      var notesCount = self.getNotesCount();
      notesDone > 0 ? $('#clearDone').fadeIn(500) : $('#clearDone').fadeOut(500);
      notesCount > 0 ? $('#clearAll').fadeIn(500) : $('#clearAll').fadeOut(500);
      $('.notesDone').html(notesDone === 1 ? 'item' : 'items');
      $('#notesDone').html(notesDone);
      $('.notesCountText').html(notesCount === 1 ? 'item' : 'items');
      $('#notesCount').html(notesDone + ' / ' + notesCount);
      return self;
    },
    // Simple MVC built-in initalize method which runs after 1 ms
    init : function(object) {
      object
        .focusInput();
    }
  };
  var settings = {
    // Controller (UI button/input handler) - bind automatically to UI/View
    controller: MVC.Controller({
      //Event handler for clear done notes button
      clearDone : function(event, object) {
        object.clearDone();
      },
      //Event handler for clear all notes button
      clearAll : function(event, object) {
        object.clearAll();
      }
    }),
    // bind keyup (enter/return) event to input[name='create']
    keyup : function(event, name, value, object) {
      if(name === 'create') {
        if(MVC.KeyCheck(event, 'enter')) {
          $(event.target).val(''); //Clear the input
          object.add(value, false);
        }
      }
    }
  };
  //Run the Todo List App (object) which manages the todo notes
  var todoList = $('#todos').ModelView(model, settings, methods);

  console.log($.fn);
});