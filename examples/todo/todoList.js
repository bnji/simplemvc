$(function() {
  // The Model's data for the todoList.
  // Data can later be retreived using the .Get()-method
  var todoListData = {
    name: "bendot's todo-list :)",
    notes: MVC.List() //Use our "special" MVC Array with extra methods
  };

  // Define extra functionality for the todoList object, by implementing new
  // functions/methods here.
  var todoListMethods = {
    // Is the input data entered valid?
    isValidInput : function(data) {
      return $.trim(data).length > 0;
    },
    // Create a new note
    add : function(value, isComplete, id) {
      //Only if the note has some text
      if(todoList.isValidInput(value)) {
        var note = new Note(this, value, isComplete, id);
        var noteId = note.Get('id');
        var noteData = note.GetModelData();
        todoList
            .getNotes() //Retrieve the list of notes
            .Add(note); //Add the note to the todoList
        todoList
            .updateUI(note) //Update databound elements
            .onCheckNote(note); //Update databound elements
        store
          .save(noteId, noteData); //Store the data
      }
    },
    remove : function(note) {
      var isRemoved = todoList
                        .getNotes() //Get the list of notes (Array)
                        .Remove(note); //Remove the note (from the Array)
      if(isRemoved) {
        todoList
          .updateUI(note) //Update databound elements
          .onCheckNote(note) //Update databound elements
          .focusInput();

        store
          .remove(note.Get('id')); //Remove the note (from the storage)

        $(this).remove(); //Remove the note from the View
      }
      return todoList;
    },
    getNotes : function() {
      return todoList.Get('notes');
    },
    getNotesDone : function() {
      var notesDone = MVC.List();
      $.each(todoList.getNotes(), function(i, note) {
        if(note.Get('isComplete')) {
          notesDone.Add(note);
        }
      });
      return notesDone;
    },
    getNotesCount : function() {
      return todoList.getNotes().length;
    },
    getNotesDoneCount : function() {
      return todoList.getNotesDone().length;
    },
    clearDone : function(removeAll) {
      $.each(todoList.getNotes(), function(k, note) {
        if(removeAll || note.Get('isComplete')) {
          $(note.GetViewId()).slideUp('slow', function() {
            todoList.remove(note); //Remove the note the Model
            //console.log("Notes count: " + todoList.getNotes().length);
          });
        }
      });
      return todoList;
    },
    clearAll : function() {
      return this.clearDone(true);
    },
    focusInput : function() {
      todoList
        .Find('.create')
        .val('')
        .focus();
    },
    load : function() {
      var notesFromStore = store.getAll();
      $.each(notesFromStore, function(k,v) {
        todoList.add(v['note'], v['isComplete'], k);
      });
    },
    clear : function() {
      store.clear();
      return todoList.clearAll();
    },
    updateUI : function(note) {
      $('.notesCountText').html(todoList.getNotesCount() === 1 ? 'item' : 'items');
      $('#notesCount').html(todoList.getNotesDoneCount() + ' / ' + todoList.getNotesCount());
      return todoList;
    },
    onCheckNote : function(note) {
      var noteElem = note.Find('#note');
      var notesDone = todoList.getNotesDoneCount();

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
      $('#notesCount').html(notesDone + ' / ' + todoList.getNotesCount());
      return todoList;
    },
    init : function() {
      todoList.focusInput();
      todoList.load();
    }
  };

  /**
   * Settings
   * Implementation of three different methods, which will automatically get
   * bound to the view.
   */
  var todoListSettings = {
    controller: MVC.Controller({
      //Button clear done will clear the done notes
      clearDone : function() {
        todoList.clearDone();
      },
      //Button clear all will clear all notes
      clearAll : function() {
        todoList.clearAll();
      },
      //Button export json will generate a file containing the todoLists notes as json objects
      exportJSON : function() {
        var data = {};
        $.each(todoList.getNotes(), function(k, v) {
          data[k] = v.GetModelData();
        });
        JSON.save(JSON.stringify(data, null, 2),
          function(data) {
            // alert(JSON.stringify(data));
            window.location = '//sprotin.azurewebsites.net/simplemvc/downloadfile.php?filename=' + data['name'];
            // $('#jsonFileUrl').html('<a href="'+data['url']+'">Open the JSON file.</a>');
          }
        );
      }
    }), //end controller
    keyup : function(e, n, v) {
      if(n === 'create') {
        if(MVC.KeyCheck(e, 'enter')) {
          $(e.target).val(''); //Clear the input
          todoList.add(v, false);
          //todoList.RunCtr('createNote', {value:v, isComplete:false}) //Add the note
        }
      }
      // todoList.SetModelFromView();
      //todoList.SetViewFromModel();
    }
  };

  //Create a todoList (object literal) which manages the todo notes
  var todoList = $('#todos').ModelView(todoListData, todoListSettings, todoListMethods);
  setTimeout(function() {
    console.log(todoList.GetModelData());
    $.each(todoList.getNotes(), function(k, v) {
      console.log(v.note);
    });
  },1000);
});