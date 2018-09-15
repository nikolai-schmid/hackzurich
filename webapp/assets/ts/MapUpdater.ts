class MapUpdater {
    private map = null;
    private gmarkers: Array<any> = [];

    constructor(map) {
        this.map = map;
    }

    public removeMarker() {
        for (var i = 0; i < this.gmarkers.length; i++) {
            this.gmarkers[i].setMap(null);
        }
    }

    public updateMarker(marker: Marker, stay = false) {
        var pos = {lat: marker.lat, lng: marker.lng};
        var gmarker = new google.maps.Marker({
            position: pos,
            icon: marker.icon,
            map: marker.map
        });

        if (stay) return;

        this.gmarkers[0] = gmarker;
    }

    public alert(lat, lng, map) {
        this.updateMarker(new Marker(lat, lng, 0, map, "assets/speed.png"), true);
        var audio = new Audio('assets/slow_down.mp3');
        audio.play();
    }

    private calcAngle(startLat, startLong, endLat, endLong) {
        function radians(n) {
            return n * (Math.PI / 180);
        }

        function degrees(n) {
            return n * (180 / Math.PI);
        }

        startLat = radians(startLat);
        startLong = radians(startLong);
        endLat = radians(endLat);
        endLong = radians(endLong);

        var dLong = endLong - startLong;

        var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
        if (Math.abs(dLong) > Math.PI) {
            if (dLong > 0.0) {
                dLong = -(2.0 * Math.PI - dLong);
            } else {
                dLong = (2.0 * Math.PI + dLong);
            }
        }

        return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
    }
}

class Marker {
    public lat;
    public lng;
    public angle;
    public map;
    public icon;

    constructor(lat, lng, angle, map, icon) {
        this.lat = lat;
        this.lng = lng;
        this.angle = angle;
        this.map = map;
        this.icon = icon;
    }
}