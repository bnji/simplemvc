$(function() {
  /**
   * Implementation of three different methods, which will automatically get
   * bound to the view.
   */
  var notebookController = MVC.Controller({
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
  });
  
  //The Model's data for the notebook
  var notebookData = {
    notes: MVC.List() //Use our MVC Array with extra methods
  };
  
  //Define extra functionality for the notebook object, by implementing new
  //functions/methods here.
  var notebookMethods = {
    /**
     * Is the input data entered valid?
     */
    isValidInput : function(data) {
      return $.trim(data).length > 0;
    },
    /**
     * Create a new note
     */
    createNote : function(value, isComplete, id) {
      //Only if the note has some text
      if(notebook.isValidInput(value)) {
        
        //var value = "a b.c d f.o sdf";
        /*var regUrl = /[a-zA-Z0-9\-\.]{1,255}\.[a-z]{1,255}/;
        var match = regUrl.exec(value);
        var url = '<a href="'+match+'">'+match+'</a>';
        console.log(value);
        if(regUrl.test(value)) {
          //value = url;
          value = value.replace(match, url);
          //console.log(match);
        }*/
       
       
        var noteData = {
          id: (id === undefined || id === null ? $.now() : id),
          isComplete: isComplete,
          note: value
        }
        
        //The note data (it's field members and methods)
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
          }
        };
       
        //The note controller for the GUI buttons
        var noteController = MVC.Controller({
          showData : function() {
            alert(JSON.stringify(note.GetModelData(), null, 2));
          }
        });
        
        //
        var noteSettings = {
          controller: noteController,
          change: function(e, n, v) {
            note
              .save(); //save the note
            notebook
              .onCheckNote(note);
          },
          keyup: function(e, n, v) {
            if(notebook.isValidInput(v)) {
              if(MVC.KeyCheck(e, 'enter')) {
                note
                  .save(); //save the note
                note
                  .toggleMode(); //Toggle to view mode again
              }
              if(MVC.KeyCheck(e, 'escape')) {
                if(notebook.isValidInput(note)) {
                  note
                    .Find(':input[name="note"]')
                    .blur();
                }
              }
            }
          },
          blur: function() {
            note
              .toggleMode();
          },
          clone: {
              id: '#liNoteElem'+$.now(),
              withDataAndEvents: false,
              append: function(elem) {
                $('#note-list').prepend(elem);
                $(elem).show();
              }
          }
        };
        
        //Create a new note using the MVC ModelView
        var note = MVC.ModelView('#list-template', noteData, noteSettings, noteMethods);
        
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
    clearAll : function(isCompleteFilter) {
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
      printDebug();
      return notebook;
    },
    init : function() {
      notebook.focusInput();
      notebook.loadNotes();
    }
  };
  
  //Settings
  var notebookSettings = {
    controller: notebookController,
    keyup : function(e, n, v) {
      printDebug();
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
  var notebook = MVC.ModelView(
                          '#todos', 
                          notebookData, 
                          notebookSettings, 
                          notebookMethods
                          );
  
  //Clear the notebook and add 3 notes
  /*notebook
    .clear()
    .createNote('Buy some milk', true)
    .createNote('Drink the milk', false)
    .createNote('Open lifehacker.com', false);
  */
  
});



function printDebug() {
  /*DebugObj('#debug', {
    o1 : {
      object : notebook,
      readDom : true
    }
  });*/
}