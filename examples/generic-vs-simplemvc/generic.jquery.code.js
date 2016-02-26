$(function() {
  var viewNoHash = Date.now(),
      jqView = '#'+viewNoHash,
      jqModel = {
        firstName: 'Jane',
        lastName: 'Doe'
      },
      jqObject;
  $('#jQueryView').html($('#template').clone(false).attr('id', viewNoHash).show());
  jqObject = {
    set : function(key, val) {
      jqModel[key] = val;
      jqObject.updateView(key, val);
    },
    get : function(key) {
      return jqModel[key];
    },
    updateView : function(key, val) {
      $(jqView + ' [name="'+key+'"]').val(val);
    },
    init : function() {
      $(jqView + ' :input').blur(function(e) {
        jqObject.set(e.target.name, e.target.value);
        $(jqView + ' .fullName').html(jqObject.get('firstName') + ' ' + jqObject.get('lastName'));
      });
      jqObject.set('firstName', jqModel['firstName']);
      jqObject.set('lastName', jqModel['lastName']);
      $(':input').blur();
    }
  };
  jqObject.init();
});