var map, marker, latlng;

function initMap() {
  var uluru = latlng || {lat: 40.689254, lng: -74.0445};
  var contentRight = document.querySelector('#new-post .post-content-right');
  map = new google.maps.Map(contentRight.querySelector('.post-map'), {
    zoom: 15,
    center: uluru
  });
  marker = new google.maps.Marker({
    position: uluru,
    map: map,
    draggable: true
  });
  marker.addListener('dragend', () => {
    var pos = marker.getPosition();
    latlng = {lat: pos.lat(), lng: pos.lng()};
    console.log("marker dropped", latlng)
    contentRight.querySelector('input[name="latitude"]').value = latlng.lat;
    contentRight.querySelector('input[name="longitude"]').value = latlng.lng;
  });
}




// Adapted from a demo by w3schools
function showPosition(position) {
  var contentRight = document.querySelector('#new-post .post-content-right');
	latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
	contentRight.querySelector('.post-getLocation-button').hidden = true;
  contentRight.querySelector('.post-getLocation-button').textContent = "Use my current location";
  contentRight.querySelector('input[name="latitude"]').value = latlng.lat;
  contentRight.querySelector('input[name="longitude"]').value = latlng.lng;
  if(map) {
    marker.setPosition(latlng);
    map.setCenter(latlng);
  }
}

function initGetPosition() {
  document.querySelector('.post-getLocation-button').hidden = true;
  navigator.geolocation.getCurrentPosition(showPosition, showError);
}

window.addEventListener('load', () => {
  var getLocationButton = document.querySelector('.post-getLocation-button');
  if(navigator.permissions) {
    navigator.permissions.query({'name': 'geolocation'}).catch(err => {
      showError("You must enable location services to use Natural Neighbors.");
    }).then(status => {
      if(status.state == "prompt") {
        getLocationButton.addEventListener('click', initGetPosition);
      } else if(status.state == "granted") {
        initGetPosition();
      } else { // denied
        showError("You must enable location services to use Natural Neighbors.");
      }
    })
  } else {
    getLocationButton.addEventListener('click', initGetPosition);
  }
});

function showError(error) {
  var x = document.querySelector('#new-post .post-content-right');
  if(error.code) {
  	switch(error.code) {
  		case error.PERMISSION_DENIED:
  			x.innerHTML = "You must enable location services to use Natural Neighbors.";
  			break;
  		case error.POSITION_UNAVAILABLE:
  			x.innerHTML = "Location information is unavailable.";
  			break;
  		case error.TIMEOUT:
  			x.innerHTML = "The request to get user location timed out.";
  			break;
  		case error.UNKNOWN_ERROR:
  			x.innerHTML = "An unknown error occurred.";
  			break;
  	}
  } else {
    x.innerHTML = error;
  }
}
