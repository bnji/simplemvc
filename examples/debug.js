function DebugObj(target, obj) {
  var objOut = '';
  $.each(obj, function(k, v) {
    objOut += '<h2>ViewID: ' + v['object']['settings']['viewId'] + '</h2>';
    objOut += '<h3>Event type: ' + v['object']['settings']['eventUsed'] + '</h3><br />';
    objOut += '<div class="row-fluid">';
    if(v['readDom']) {
      objOut += '<div class="span6"><h4>Object View Data:</h4>' + JSON.stringify(v['object'].GetViewData(), null, 2) + '</div>';
    }
    objOut += '<div class="span6"><h4>Object Model Data:</h4>' + JSON.stringify(v['object'], null, 2) + '</div>';
    objOut += '</div><br />';
  });
  $(target).html('<hr /><h3>Debug info:</h3><pre class="prettyprint">' + objOut + '</pre>');
}