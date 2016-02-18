/**
 * An implementation using jStorage (localstorage) which saves/loads the notes.
 * http://www.jstorage.info/
 */
var store = {
  save : function(key, data) {
    $.jStorage.set(key, data);
  },
  remove : function(key) {
    $.jStorage.deleteKey(key);
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