$(function() {
  // Todo List Model
  var model = {
    name: "Simple MVC Todo List",
    notes: MVC.List() //Provides helper methods
  };
  // Todo List Implementation (methods)
  var methods = {
    isValidInput : function(data) {
      return $.trim(data).length > 0; // Is the input data entered valid?
    },
    add : function(value, isComplete, id) { // Create (add) a new note
      var self = this;
      if(self.isValidInput(value)) {
        var note = new Note(self, value, isComplete, id);
        self
            .getNotes() //Retrieve the list of notes
            .Add(note); //Add the note to the todoList
        self
            .updateUI(note) //Update databound elements
            .setIsDone(note); //Update databound elements
        store
          .save(note.Get('id'), note.GetModelData()); //Save to localstorage
        return self;
      }
    },
    remove : function(note) { // Remove an existing note
      var self = this;
      var isRemoved = self
                        .getNotes() //Get the list of notes (Array)
                        .Remove(note); //Remove the note (from the Array)
      if(isRemoved) {
        self
          .updateUI(note) //Update databound elements
          .setIsDone(note) //Update databound elements
          .focusInput();
        store
          .remove(note.Get('id')); //Remove the note (from the storage)
        $(self).remove(); //Remove the note from the View
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
    load : function() {
      var self = this;
      var notesFromStore = store.getAll();
      $.each(notesFromStore, function(k,v) {
        self.add(v['note'], v['isComplete'], k);
      });
    },
    clear : function() {
      store.clear();
      return this.clearAll();
    },
    updateUI : function(note) {
      var self = this;
      $('.notesCountText').html(self.getNotesCount() === 1 ? 'item' : 'items');
      $('#notesCount').html(self.getNotesDoneCount() + ' / ' + self.getNotesCount());
      return self;
    },
    setIsDone : function(note) {
      var self = this;
      var noteElem = note.Find('#note');
      var notesDone = self.getNotesDoneCount();
      if(note.Get('isComplete')) {
        noteElem.addClass('isComplete');
      } else {
        noteElem.removeClass('isComplete');
      }
      if(notesDone > 0) {
        $('#clearDone').fadeIn(500);
      }
      else {
        $('#clearDone').fadeOut(500);
      }
      $('.notesDone').html(notesDone === 1 ? 'item' : 'items');
      $('#notesDone').html(notesDone);
      $('#notesCount').html(notesDone + ' / ' + self.getNotesCount());
      return self;
    },
    // Simple MVC built-in method which runs after 1 ms
    init : function(object) {
      object
        .focusInput()
        .load();
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
      },
      //Event handler for downloading/exporting the todo list as a json file
      exportJSON : function(event, object) {
        var data = {};
        $.each(object.getNotes(), function(k, v) {
          data[k] = v.GetModelData();
        });
        JSON.save(JSON.stringify(data, null, 2),
          function(result) {
            window.location = '//sprotin.azurewebsites.net/simplemvc/downloadfile.php?filename=' + result['name'];
          }
        );
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
  // Allow todolist to initialize first (workaround using 1 ms timeout).
  // setTimeout(function() {
  //   console.log(todoList.GetModelData());
  //   $.each(todoList.getNotes(), function(k, v) {
  //     console.log(v.note);
  //   });
  // },1);
});