$(function() {
  var viewNoHash = Date.now(),
      obj2, objModel2, view2 = '#'+viewNoHash;
  $('#jQueryView').html($('#template').clone(false).attr('id', viewNoHash).show());
  
  objModel2 = {
    name: 'Jane Doe',
    info: 'Is also dead...'
  };
  
  obj2 = {
    save : function() {
      alert(JSON.stringify(obj2.getModelData(), null, 2));
    },
    getModelData : function() {
      return {
        name : objModel2['name'],
        info : objModel2['info']
      };
    },
    set : function(key, val) {
      objModel2[key] = val;
      obj2.updateView(key, val);
    },
    get : function(key) {
      return objModel2[key];
    },
    clearAll : function() {
      $.each(obj2.getModelData(), function(key) {
        obj2.set(key, '');
        obj2.updateView(key, '');
      });
      $(':input').keyup();
    },
    updateView : function(key, val) {
      $(view2 + ' [name="'+key+'"]').val(val);
    },
    init : function() {
      $(view2 + ' :input').keyup(function(e) {
        obj2.set(e.target.name, e.target.value);
        $(view2 + ' .previewData').html(obj2.get('name') + ' - ' + obj2.get('info'));
      });
      
      $(view2 + ' [name="Save"]').click(function(e) {
        obj2.save();
        e.preventDefault();
      });
      
      $(view2 + ' [name="Clear"]').click(function(e) {
        obj2.clearAll();
        e.preventDefault();
      });
      
      obj2.set('name', objModel2['name']);
      obj2.set('info', objModel2['info']);
      
      $(':input').keyup();
    }
  };
  
  obj2.init();
});