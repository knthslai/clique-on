export default function (map, google, coords) {

  var panPath = [];   // An array of points the current panning action will use
  var panQueue = [];  // An array of subsequent panTo actions to take
  var STEPS = 20;     // The number of steps that each panTo action will undergo

  function panTo(newLat, newLng) {
    if (panPath.length > 0) {
      // We are already panning...queue this up for next move
      panQueue.push([newLat, newLng]);
    } else {
      // Lets compute the points we'll use
      panPath.push(`LAZY SYNCRONIZED LOCK`);  // make length non-zero - 'release' this before calling setTimeout
      var curLat = map.getCenter().lat();
      var curLng = map.getCenter().lng();
      var dLat = (newLat - curLat) / STEPS;
      var dLng = (newLng - curLng) / STEPS;

      for (var i = 0; i < STEPS; i++) {
        panPath.push([curLat + dLat * i, curLng + dLng * i]);
      }
      panPath.push([newLat, newLng]);
      panPath.shift();      // LAZY SYNCRONIZED LOCK
      setTimeout(doPan, 20);
    }
  }

  function doPan() {
    var next = panPath.shift();
    if (next != null) {
      // Continue our current pan action
      map.panTo(new google.maps.LatLng(next[0], next[1]));
      setTimeout(doPan, 20);
    } else {
      // We are finished with this pan - check if there are any queue'd up locations to pan to 
      var queued = panQueue.shift();
      if (queued != null) {
        panTo(queued[0], queued[1]);
      }
    }
  }
  panTo(coords.lat, coords.lng)
}