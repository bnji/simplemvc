var ctr,
    data,
    notebook,
    settings,
    viewId = '#todos';
    
$(function() {
  
  
  
  //Controller
  ctr = MVC.Controller({
    clearDone : function() {
      notebook.clearDone();
    },
    clearAll : function() {
      notebook.clearAll();
    },
    exportJSON : function() {
      $.ajax({
        type : "POST",
        url : "http://hammerbenjamin.com/simplemvc-showcase/savejson.php",
        dataType : 'json', 
        data : {
            json : JSON.stringify(notebook.getNotes(), null, 2)
        },
        success : function(result) {
          $linkToJsonFile = '<a href="'+result['url']+'">Open the JSON file.</a>';
          $('#jsonFileUrl').html($linkToJsonFile);
        }
      });
    }
  });
  
  
  data = {
    notes: MVC.List(), //Use our MVC Array with extra methods
    isValidInput : function(data) {
      return $.trim(data).length > 0;
    },
    //Add a new note
    createNote : function(value, isComplete, id) {
      //Only if the note has some text
      if(notebook.isValidInput(value)) {
        
        /*//var value = "a b.c d f.o sdf";
        var regUrl = /[a-zA-Z0-9\-\.]{1,255}\.[a-z]{1,255}/;
        var match = regUrl.exec(value);
        var url = '<a href="'+match+'">'+match+'</a>';
        console.log(value);
        if(regUrl.test(value)) {
          //value = url;
          value = value.replace(match, url);
          //console.log(match);
        }*/
        //The note data (it's field members and methods)
        var noteData = {
          id: (id === undefined || id === null ? $.now() : id),
          isComplete: isComplete,
          note: value,
          toggleMode : function() {
            //don't toggle modes if the note is done
            if(!note.Get('isComplete')) {
              note
                .FindElement('#note')
                .toggle(500);
              note
                .FindElement(':input[name="note"]')
                .toggle(500, function(){
                  $(this).focus();
                });
            }
          },
          init : function() {
            note
              .FindElement('#note')
              .click(function() {
                note.toggleMode();
              });
          }
        };
       
        //The note controller for the GUI buttons
        var noteController = MVC.Controller({
          showData : function() {
            //note.toggleMode();
            alert(JSON.stringify(note, null, 2));
          }
        });
        
        //
        var noteSettings = {
          controller: noteController,
          change: function(e, n, v) {
            store
              .save(note); //Store the data
            notebook
              .onCheckNote(note);
          },
          keyup: function(e, n, v) {
            if(notebook.isValidInput(v)) {
              if(MVC.KeyCheck(e, 'enter')) {
                store
                  .save(note); //Store the data
                note
                  .toggleMode(); //Toggle to view mode again
              }
              if(MVC.KeyCheck(e, 'escape')) {
                if(notebook.isValidInput(note)) {
                  note
                    .FindElement(':input[name="note"]')
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
        var note = MVC.ModelView('#list-template', noteData, noteSettings);
        
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
        .save(note); //Store the note
        
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
          .remove(note); //Remove the note (from the storage)
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
        .FindElement('.create')
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
      var noteElem = note.FindElement('#note');
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
  }
  
  //Settings
  settings = {
    controller: ctr,
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
  notebook = MVC.ModelView(viewId, data, settings);
  
  //Clear the notebook and add 3 notes
  /*notebook
    .clear()
    .createNote('Buy some milk', true)
    .createNote('Drink the milk', false)
    .createNote('Open lifehacker.com', false);
  */
  
  
  
  
  /*$.each(notebook, function(k, v) {
    var t = typeof v;
    if(t.toString() !== 'function' && t.toString() !== 'object') {
      console.log(k + " is a " + t);
    }
  });*/
  
  
});

/**
 * An implementation using jStorage (localstorage) which saves/loads the notes.
 * http://www.jstorage.info/
 */
var store = {
  save : function(note) {
    var key = note.Get('id');
    var value = {
      note: note.Get('note'), 
      isComplete: note.Get('isComplete')
    };
    $.jStorage.set(key, value);
  },
  remove : function(note) {
    $.jStorage.deleteKey(note.Get('id'));
  },
  clear : function() {
    $.jStorage.flush();
  },
  get : function(key) {
    return $.jStorage.get(key);
  },
  getAll : function() {
    var data = {};
    var storeData = $.jStorage.index();
    if(storeData !== undefined || storeData !== null) {
      $.each(storeData, function(k, v) {
        data[v] = store.get(v);
        //console.log(data[v]);
      });
    }
    return data;
  }
}

function printDebug() {
  /*DebugObj('#debug', {
    o1 : {
      object : notebook,
      readDom : true
    }
  });*/
}