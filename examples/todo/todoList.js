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
  createNote : function(value, isComplete, id) {
    //Only if the note has some text
    if(todoList.isValidInput(value)) {
      this.add(new Note(this, value, isComplete, id));
    }
  },
  add : function(note) {
    todoList
        .getNotes() //Retrieve the list of notes
        .Add(note); //Add the note to the todoList

    todoList
        .onAddRemove(note) //Update databound elements
        .onCheckNote(note); //Update databound elements

    store
      .save(note.Get('id'), note.GetModelData()); //Store the data

    return todoList;
  },
  remove : function(note) {
    var isRemoved = todoList
                      .getNotes() //Get the list of notes (Array)
                      .Remove(note); //Remove the note (from the Array)
    if(isRemoved) {
      todoList
        .onAddRemove(note) //Update databound elements
        .onCheckNote(note) //Update databound elements
        .focusInput();

      store
        .remove(note.Get('id')); //Remove the note (from the storage)
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
  clearDone : function() {
    $.each(todoList.getNotes(), function(k, note) {
      if(note.Get('isComplete')) {
        $(note.GetViewId()).slideUp('slow', function() {
          todoList.remove(note); //Remove the note the Model
          $(this).remove(); //Remove the note from the View
          //console.log("Notes count: " + todoList.getNotes().length);
        });
      }
    });
    return todoList;
  },
  clearAll : function() {
    $.each(todoList.getNotes(), function(k, note) {
      $(note.GetViewId()).slideUp('slow', function() {
        todoList.remove(note); //Remove the note the Model
        $(this).remove(); //Remove the note from the View
        //console.log("Notes count: " + todoList.getNotes().length);
      });
    });
    return todoList;
  },
  focusInput : function() {
    todoList
      .Find('.create')
      .val('')
      .focus();
  },
  loadNotes : function() {
    var notesFromStore = store.getAll();
    $.each(notesFromStore, function(k,v) {
      todoList.createNote(v['note'], v['isComplete'], k);
    });
  },
  clear : function() {
    store.clear();
    return todoList.clearAll();
  },
  onAddRemove : function(note) {
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
    todoList.loadNotes();
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
          $('#jsonFileUrl').html('<a href="'+data['url']+'">Open the JSON file.</a>');
        }
      );
    }
  }), //end controller
  keyup : function(e, n, v) {
    if(n === 'create') {
      if(MVC.KeyCheck(e, 'enter')) {
        $(e.target).val(''); //Clear the input
        todoList.createNote(v, false);
        //todoList.RunCtr('createNote', {value:v, isComplete:false}) //Add the note
      }
    }
    todoList.SetModelFromView();
    //todoList.SetViewFromModel();
  }
};

//Create a todoList (object literal) which manages the todo notes
var todoList = $('#todos').ModelView(todoListData, todoListSettings, todoListMethods);
});