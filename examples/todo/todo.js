$(function() {
// The Model's data for the notebook.
// Data can later be retreived using the .Get()-method
var notebookData = {
  name: "bendot's todo-list :)",
  notes: MVC.List() //Use our "special" MVC Array with extra methods
};

// Define extra functionality for the notebook object, by implementing new
// functions/methods here.
var notebookMethods = {
  /**
   * Is the input data entered valid?
   */
  isValidInput : function(data) {
    return $.trim(data).length > 0;
  },
  /*
  Create a new note
  */
  createNote : function(value, isComplete, id) {
    //Only if the note has some text
    if(notebook.isValidInput(value)) {

      var noteData = {
        id: (id === undefined || id === null ? Date.now() : id),
        isComplete: isComplete,
        note: value
      };

      /*
      Methods and fields (functions and variables)
      */
      var noteMethods = {
        save : function() {
          store.save(note.Get('id'), note.GetModelData()); //Store the data
        },
        toggleMode : function() {
          //don't toggle modes if the note is done
          if(!note.Get('isComplete')) {
            note
              .Find('#note')
              .toggle(500);
            note
              .Find(':input[name="note"]')
              .toggle(500, function(){
                $(this).focus();
              });
          }
        },
        init : function() {
          note
            .Find('#note')
            .click(function() {
              note.toggleMode();
            });
            //alert("OK");
        }
      };


      var noteSettings = {
        //The note controller for the GUI buttons
        controller: MVC.Controller({
          showData : function() {
            alert(JSON.stringify(note.GetModelData(), null, 2));
          }
        }),
        change: function(e, n, v) {
          note.save(); //save the note
          notebook.onCheckNote(note);
        },
        keyup: function(e, n, v) {
          if(notebook.isValidInput(v)) {
            if(MVC.KeyCheck(e, 'enter')) {
              note.save(); //save the note
              note.toggleMode(); //Toggle to view mode again
            }
            else if(MVC.KeyCheck(e, 'escape')) {
              if(notebook.isValidInput(note)) {
                note
                  .Find(':input[name="note"]')
                  .blur();
              }
            }
          }
        },
        blur: function() {
          note.toggleMode();
        },
        clone: {
            id: '#liNoteElem'+Date.now(),
            withDataAndEvents: false,
            append: function(elem) {
              $('#note-list').prepend(elem);
              $(elem).show();
            }
        }
      };

      //Create a new note using the MVC ModelView
      var note = $('#list-template').ModelView(noteData, noteSettings, noteMethods);
      //note.toggleMode();
      notebook.add(note);
    }
    return notebook;
  },
  add : function(note) {
    notebook
        .getNotes() //Retrieve the list of notes
        .Add(note); //Add the note to the notebook

    notebook
        .onAddRemove(note) //Update databound elements
        .onCheckNote(note); //Update databound elements

    store
      .save(note.Get('id'), note.GetModelData()); //Store the data

    return notebook;
  },
  remove : function(note) {
    var isRemoved = notebook
                      .getNotes() //Get the list of notes (Array)
                      .Remove(note); //Remove the note (from the Array)
    if(isRemoved) {
      notebook
        .onAddRemove(note) //Update databound elements
        .onCheckNote(note) //Update databound elements
        .focusInput();

      store
        .remove(note.Get('id')); //Remove the note (from the storage)
    }
    return notebook;
  },
  getNotes : function() {
    return notebook.Get('notes');
  },
  getNotesDone : function() {
    var notesDone = MVC.List();
    $.each(notebook.getNotes(), function(i, note) {
      if(note.Get('isComplete')) {
        notesDone.Add(note);
      }
    });
    return notesDone;
  },
  getNotesCount : function() {
    return notebook.getNotes().length;
  },
  getNotesDoneCount : function() {
    return notebook.getNotesDone().length;
  },
  clearDone : function() {
    $.each(notebook.getNotes(), function(k, note) {
      if(note.Get('isComplete')) {
        $(note.GetViewId()).slideUp('slow', function() {
          notebook.remove(note); //Remove the note the Model
          $(this).remove(); //Remove the note from the View
          //console.log("Notes count: " + notebook.getNotes().length);
        });
      }
    });
    return notebook;
  },
  clearAll : function() {
    $.each(notebook.getNotes(), function(k, note) {
      $(note.GetViewId()).slideUp('slow', function() {
        notebook.remove(note); //Remove the note the Model
        $(this).remove(); //Remove the note from the View
        //console.log("Notes count: " + notebook.getNotes().length);
      });
    });
    return notebook;
  },
  focusInput : function() {
    notebook
      .Find('.create')
      .val('')
      .focus();
  },
  loadNotes : function() {
    var notesFromStore = store.getAll();
    $.each(notesFromStore, function(k,v) {
      notebook.createNote(v['note'], v['isComplete'], k);
    });
  },
  clear : function() {
    store.clear();
    return notebook.clearAll();
  },
  onAddRemove : function(note) {
    $('.notesCountText').html(notebook.getNotesCount() === 1 ? 'item' : 'items');
    $('#notesCount').html(notebook.getNotesDoneCount() + ' / ' + notebook.getNotesCount());
    return notebook;
  },
  onCheckNote : function(note) {
    var noteElem = note.Find('#note');
    var notesDone = notebook.getNotesDoneCount();

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
    $('#notesCount').html(notesDone + ' / ' + notebook.getNotesCount());
    return notebook;
  },
  init : function() {
    notebook.focusInput();
    notebook.loadNotes();
  }
};

/**
 * Settings
 * Implementation of three different methods, which will automatically get
 * bound to the view.
 */
var notebookSettings = {
  controller: MVC.Controller({
    //Button clear done will clear the done notes
    clearDone : function() {
      notebook.clearDone();
    },
    //Button clear all will clear all notes
    clearAll : function() {
      notebook.clearAll();
    },
    //Button export json will generate a file containing the notebooks notes as json objects
    exportJSON : function() {
      var data = {};
      $.each(notebook.getNotes(), function(k, v) {
        data[k] = v.GetModelData();
      });
      JSON.save(JSON.stringify(data, null, 2),
        function(data) {
          $('#jsonFileUrl').html('<a href="'+data['url']+'">Open the JSON file.</a>');
        }
      );
    }
  }), //end controller
  keyup : function(e, n, v) {
    if(n === 'create') {
      if(MVC.KeyCheck(e, 'enter')) {
        $(e.target).val(''); //Clear the input
        notebook.createNote(v, false);
        //notebook.RunCtr('createNote', {value:v, isComplete:false}) //Add the note
      }
    }
    notebook.SetModelFromView();
    //notebook.SetViewFromModel();
  }
};

//Create a notebook (object literal) which manages the todo notes
var notebook = $('#todos').ModelView(notebookData, notebookSettings, notebookMethods);
});