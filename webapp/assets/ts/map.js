var map = null;
var mapUpdater = null;
var dangerPredictor = new DangerPredictor();
var directionsService = null;
var directionsDisplay = null;
var inDangerCount = 0;

var pointNum = 0;
var markerIndex = 0;

function initMap() {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 47.37, lng: 8.53 }
    });
    directionsDisplay.setMap(map);
    mapUpdater = new MapUpdater(map);

    var onChangeHandler = () => {
        mock();
    };

    onChangeHandler();
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
}

function mock() {
    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            var routes = response.routes[0]
            var points = routes.overview_path

            updateMarkers(points);

            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function updateMarkers(points) {
    var routes = [];
    for (let point of points) {
        routes.push([point.lat(), point.lng()]);
    }
    var data = {
        routes: routes,
        persona: {
            "time": 10,
            "age": 17,
            "vehicle": 3,
            "weather": 3,
            "sex": 1
        }
    }

    let dangers = dangerPredictor.getDangersOnRoute(data);

    var updateMarkersInterval = setInterval(() => {
        mapUpdater.removeMarker();
        var angle = mapUpdater.calcAngle(parseFloat(points[0].lat()), parseFloat(points[0].lng()), parseFloat(points[1].lat()), parseFloat(points[1].lng()))

        var icon = {
            path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
            scale: 0.4,
            fillColor: "#427af4",
            fillOpacity: 1,
            strokeWeight: 1,
            anchor: new google.maps.Point(0, 5),
            rotation: angle
        };

        var lat = points.shift().lat();
        var lng = points.shift().lng();
        markerIndex++;

        mapUpdater.updateMarker(new Marker(lat, lng, angle, map, icon));

        if (points.length < 2) {
            clearInterval(updateMarkersInterval);
            return;
        }

        if (dangerPredictor.hasUpcomingDanger(pointNum++, dangers)) {
            if (inDangerCount === 0) {
                let dangerPoint = points[markerIndex + DangerPredictor.PREDICTION_OVERHEAD];
                mapUpdater.alert(dangerPoint.lat(), dangerPoint.lng(), map)
            }

            inDangerCount += DangerPredictor.PREDICTION_OVERHEAD;
        }
    }, 300);
}