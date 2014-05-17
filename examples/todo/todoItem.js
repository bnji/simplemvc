var Note = function Note(notebook, value, isComplete, id) {
  // Methods and fields (functions and variables)
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
    },
    showData : function() {
      alert(JSON.stringify(note.GetModelData(), null, 2));
    }
  };


  var noteSettings = {
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
  var note = $('#list-template').ModelView({
      id: (id === undefined || id === null ? Date.now() : id),
      isComplete: isComplete,
      note: value
    },
    noteSettings,
    noteMethods);

  return note;
}