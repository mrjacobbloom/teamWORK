(function() {
  var map, marker, latlng = {lat: 40.689254, lng: -74.0445}, placesService;

  function initMap() {
    var newPost = document.querySelector('#new-post');
    map = new google.maps.Map(newPost.querySelector('.post-map'), {
      zoom: 15,
      center: latlng
    });
    marker = new google.maps.Marker({
      position: latlng,
      map: map,
      draggable: true
    });
    marker.addListener('dragend', () => {
      var pos = marker.getPosition();
      latlng = {lat: pos.lat(), lng: pos.lng()};
      newPost.querySelector('input[name="latitude"]').value = latlng.lat;
      newPost.querySelector('input[name="longitude"]').value = latlng.lng;
    });
    map.addListener('click', e => {
      var pos = e.latLng;
      marker.setPosition(pos);
      latlng = {lat: pos.lat(), lng: pos.lng()};
      newPost.querySelector('input[name="latitude"]').value = latlng.lat;
      newPost.querySelector('input[name="longitude"]').value = latlng.lng;
    });
    placesService = new google.maps.places.PlacesService(map);
  }


  // Adapted from a demo by w3schools
  function showPosition(position) {
    if(position) {
      latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
    }
    var contentLeft = document.querySelector('#new-post .post-content-left');
    contentLeft.querySelector('input[name="latitude"]').value = latlng.lat;
    contentLeft.querySelector('input[name="longitude"]').value = latlng.lng;
    if(map) {
      marker.setPosition(latlng);
      map.setCenter(latlng);
    }
  }
  
  function handleButtonClick() {
    var val = document.querySelector('#post-location-search').value;
    if(val.length) {
      placesService.textSearch({query: val}, (results, status) => {
        if(status == 'OK') {
          if(results.length == 0) {
            showError('No results for your search');
          } else {
            clearError();
            let location = results[0].geometry.location;
            latlng = {lat: location.lat(), lng: location.lng()};
            showPosition();
          }
        } else {
          showError('There was a problem with your search');
        }
      });
    } else {
      clearError();
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
  }

  window.addEventListener('load', () => {
    if(google && google.maps) {
      initMap();
    } else {
      let script = document.querySelector('#google-maps-api');
      script.addEventListener('load', initMap);
    }
    
    var button = document.querySelector('#post-location-button');
    button.style.minWidth = button.offsetWidth + 'px';
    var searchbox = document.querySelector('#post-location-search');
    button.addEventListener('click', handleButtonClick);
    
    searchbox.addEventListener('input', e => {
      if(searchbox.value.length) {
        button.textContent = 'Search';
      } else {
        button.textContent = 'Current Location';
      }
    });
    searchbox.addEventListener('keypress', e => {
      if (e.keyCode === 13) {
          handleButtonClick();
          searchbox.blur(); // idk it feels right
      }
    });
    
    document.querySelector('#new-post .post-title-input-group').addEventListener('click', e => {
      var titleInput = document.querySelector('#new-post .post-title-input');
      if(titleInput != document.activeElement) {
        titleInput.focus();
      }
    });
  });

  function showError(error) {
    var x = document.querySelector('#new-post #post-error');
    x.hidden = false;
    if(error.code) {
    	switch(error.code) {
    		case error.PERMISSION_DENIED:
    			x.textContent = "You must enable location services to use your current location";
    			break;
    		case error.POSITION_UNAVAILABLE:
    			x.textContent = "Location information is unavailable";
    			break;
    		case error.TIMEOUT:
    			x.textContent = "The request to get user location timed out";
    			break;
    		case error.UNKNOWN_ERROR:
    			x.textContent = "An unknown error occurred";
    			break;
    	}
    } else {
      x.innerHTML = error;
    }
  }
  function clearError() {
    document.querySelector('#new-post #post-error').hidden = true;
  }
})();
