function initMap() {
    var markers = [];
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {
            lat: 0,
            lng: 0
        }
    });
    var infoWindow = new google.maps.InfoWindow({
        map: map
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var marker = new google.maps.Marker({
                position: pos,
                map: map
            });
            map.setCenter(pos);

            console.log(pos);
            $.post('/currentposition', pos, function(response) {
                $('#audiosection').empty();
                var points = response.points;
                console.log(points);
                markers = [];
                markers = points.map(function(location, i) {
                    // var audio = '<audio src="./sounds/'+location.sound+'.wav" autoplay loop="1"><p>apparently your browser does support audio playback, bummer dude</p></audio>';
                    // $('#audiosection').append(audio);
                    return new google.maps.Marker({
                        position: location,
                        map: map,
                        label: location.id.toString()
                    });

                });
                // infoWindow.setPosition(pos);
                // infoWindow.setContent(response.points.length + ' people within 10 miles of here.');
                // console.log(JSON.stringify(response));
            });
            //

            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    map.addListener('dragend', function() {
        var center = map.getCenter().toJSON();
        console.log(center);
        $.post('/currentposition', center, function(response) {
            var points = response.points;
            console.log(points);
            deleteMarkers();
            markers = points.map(function(location, i) {
                return new google.maps.Marker({
                    position: location,
                    map: map
                });
            });
            infoWindow.setPosition(center);
            infoWindow.setContent(response.points.length + ' people within 10 miles of here.');
        });

    });
    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }

    // Shows any markers currently in the array.
    function showMarkers() {
        setMapOnAll(map);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}
