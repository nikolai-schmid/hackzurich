class DangerPredictor {
    public static PREDICTION_OVERHEAD = 10;

    private directionsService;
    private mapUpdater;
    private apiCommunicator: ApiCommunicator;

    public constructor(directionsService, mapUpdater) {
        this.directionsService = directionsService;
        this.mapUpdater = mapUpdater;
        this.apiCommunicator = new ApiCommunicator();
    }

    public hasUpcomingDanger(pointIndex, dangers): boolean {
       if (dangers[pointIndex + DangerPredictor.PREDICTION_OVERHEAD] === 1) {
            return true;
        }

        return false;
    }

    public getDangersOnRoute(data) {
        return this.apiCommunicator.checkDangerForRoute(data);
    }

    private calcDistance(lat1, lon1, lat2, lon2) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta/180

        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }

        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        dist = dist * 1.609344

        return dist
    }
}

class Danger {
    public dangerType: DangerType;
    public lat;
    public lng;

    constructor(dangerType: DangerType, lat, lng) {
        this.dangerType = dangerType;
        this.lat = lat;
        this.lng = lng;
    }
}

enum DangerType {
    NONE, SPEED, VISION, STUPIDITY
}