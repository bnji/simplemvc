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
function moveDown(selector, topPadding) {
    var offset = $(selector).offset();
    if(offset === null) {
      return;
    }
    $(window).scroll(function () {
      try {
         if ($(window).scrollTop() > offset.top) {
            $(selector).stop().animate({
                marginTop: $(window).scrollTop() - offset.top + topPadding
                //$(selector).css({"background-color", "red" })
                //marginTop: event.pageY - divOffset.top - adjustOffset;
            }, {duration:500, queue:false});
        } else {
            $(selector).stop().animate({
                marginTop: 0
            });
        }
      } catch(e) {
        alert(e);
      }
    });
}
function getFiddleUrl(fiddleName) {
  return 'http://jsfiddle.net/bendot/'+fiddleName+'/embedded/result,js,html';
}