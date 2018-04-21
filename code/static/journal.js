// Adapted from a demo by w3schools

function showPosition(position) {
  var contentRight = document.querySelector('#new-post .post-content-right');
	var latlon = position.coords.latitude + "," + position.coords.longitude;
	var img_url = `https://maps.googleapis.com/maps/api/staticmap?center=${latlon}&markers=|${latlon}&zoom=16&size=400x300&key=AIzaSyBV3jNuAHYiFPCPRgEUJ-4SHBZxQ3c3Pr0`;
	contentRight.querySelector('.post-getLocation-button').hidden = true;
  contentRight.querySelector('.post-getLocation-button').textContent = "Use my current location";
  contentRight.querySelector('.post-map').hidden = false;
  contentRight.querySelector('.post-map').src = img_url;
  contentRight.querySelector('input[name="latitude"]').value = position.coords.latitude;
  contentRight.querySelector('input[name="longitude"]').value = position.coords.longitude;
}

function initGetPosition() {
  document.querySelector('.post-getLocation-button').textContent = "Loading...";
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
