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
    }
  });
  
  
  data = {
    notes: MVC.List(), //Use our MVC Array with extra methods
    //Add a new note
    addNote : function(note, isComplete, id) {
      //Only if the note value isn't empty
      if($.trim(note).length > 0) {
        
        var noteData = {
          id: (id === undefined || id === null ? $.now() : id),
          isComplete: isComplete,
          note: note,
          toggleMode : function() {
            note.FindElement('#note').toggle(500);
            note.FindElement(':input[name="note"]').toggle(500, function(){
              $(this).focus();
            });
          },
          init : function() {
            note.FindElement('#note').click(function() {
              note.toggleMode();
            });
          }
        };
       
        var noteCtr = MVC.Controller({
          showData : function() {
            //note.toggleMode();
            alert(JSON.stringify(note, null, 2));
          }
        });
        
        //Create a new note using the MVC ModelView
        var note = MVC.ModelView('#list-template', noteData, {
          controller: noteCtr,
          change: function(e, n, v) {
            notebook.onCheckNote(note);
            //note.SetModelFromView();
          },
          keyup: function(e, n, v) {
            if($.trim(v).length > 0) {
              if(MVC.KeyCheck(e, 'enter')) {
                note.Set(n, v);
                note.toggleMode();
              }
              if(MVC.KeyCheck(e, 'escape')) {
                //note.toggleMode();
              }
            }
            //note.SetModelFromView();
          },
          blur: function() {
            note.toggleMode();
          },
          clone: {
              id: '#liNoteElem'+$.now(),
              withDataAndEvents: false,
              append: function(elem) {
                $('#note-list').prepend(elem);
                $(elem).show();
              }
          }
        });
        //Add the not to the notebook
        notebook
          .getNotes()
          .Add(note);
        notebook
          .onAddRemove(note)
          .onCheckNote(note);
        
        store.add(note);
      }
      return notebook;
    },
    onAddRemove : function(note) {
      var notesCount = notebook.getNotesCount();
      $('.notesCountText').html(notesCount === 1 ? 'item' : 'items');
      $('#notesCount').html(notebook.getNotesDoneCount() + ' / ' + notesCount);
      //$.jStorage.set(note.Get('id'), note)
      return notebook;
    },
    onCheckNote : function(note) {
      var noteElem = note.FindElement('#note');
      //console.log(noteElem);
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
    updateNote : function(note, newValue) {
      note.Set('note', newValue);
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
    removeNote : function(note) {
      var isRemoved = notebook.getNotes().Remove(note);
      if(isRemoved) {
        store.remove(note);
        notebook.onAddRemove(note);
        notebook.onCheckNote(note);
        notebook.focusInput();
        //console.log('Removed note: ' + note);
      }
      return notebook;
    },
    clearDone : function() {
      $.each(notebook.getNotes(), function(k, note) {
        if(note.Get('isComplete')) {
          $(note.GetViewId()).slideUp('slow', function() {
            notebook.removeNote(note); //Remove the note the Model
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
          notebook.removeNote(note); //Remove the note the Model
          $(this).remove(); //Remove the note from the View
          //console.log("Notes count: " + notebook.getNotes().length);
        });
      });
      return notebook;
    },
    focusInput : function() {
      notebook.FindElement('.create').val('').focus();
    },
    loadNotes : function() {
      var notesFromStore = store.getAll();
      $.each(notesFromStore, function(k,v) {
        notebook.addNote(v['note'], v['isComplete'], k);
      });
    },
    empty : function() {
      $.jStorage.flush();
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
          notebook.addNote(v, false);
          //notebook.RunCtr('addNote', {value:v, isComplete:false}) //Add the note
        }
      }
      notebook.SetModelFromView();
      //notebook.SetViewFromModel();
    }
    
  };
  
  //Create a notebook (object literal) which manages the todo notes
  notebook = MVC.ModelView(viewId, data, settings);
  
  //Add two notes
  /*notebook
    .empty()
    .addNote('Buy some milk', true)
    .addNote('Drink the milk', false)
    .addNote('Open lifehacker.com', false);
  */
  
  
  
  
  /*$.each(notebook, function(k, v) {
    var t = typeof v;
    if(t.toString() !== 'function' && t.toString() !== 'object') {
      console.log(k + " is a " + t);
    }
  });*/
  
  $('.note').tooltip({
    animation: true,
    placement: 'left',
    title: 'Click to edit',
    trigger: 'hover',
    delay: { show: 100, hide: 250 }
  });
  
  
});

/**
 * An implementation using jStorage (localstorage) which saves/loads the notes.
 * http://www.jstorage.info/
 */
var store = {
  add : function(note) {
    var key = note.Get('id');
    var value = {
      note: note.Get('note'), 
      isComplete: note.Get('isComplete')
    };
    if(store.get(key) === null) {
      $.jStorage.set(key, value);
    }
  },
  remove : function(note) {
    $.jStorage.deleteKey(note.Get('id'));
  },
  get : function(key) {
    return $.jStorage.get(key);
  },
  getAll : function() {
    var data = {};
    $.each($.jStorage.index(), function(k, v) {
      data[v] = store.get(v);
      //console.log(data[v]);
    });
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