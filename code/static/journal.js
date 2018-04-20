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

function getLocation(event) {
  event.target.textContent = "Loading...";
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	} else {
		//x.innerHTML = "Geolocation is not supported by this browser.";
	}
}
window.addEventListener('load', () => {
  var getLocationButton = document.querySelector('.post-getLocation-button');
  getLocationButton.addEventListener('click', getLocation);
});

function showError(error) {
	/*switch(error.code) {
		case error.PERMISSION_DENIED:
			x.innerHTML = "Please turn on location services to use this feature."
			break;
		case error.POSITION_UNAVAILABLE:
			x.innerHTML = "Location information is unavailable."
			break;
		case error.TIMEOUT:
			x.innerHTML = "The request to get user location timed out."
			break;
		case error.UNKNOWN_ERROR:
			x.innerHTML = "An unknown error occurred."
			break;
	}*/
}
