$(function() {
  $('#template').ModelView({
    firstName: 'John',
    lastName: 'Doe'
  }, {
    clone: '#simpleMvcView'
  }).Set('fullName', function(o) {
    return ("{0} {1}").format(o.firstName, o.lastName);
  });
});