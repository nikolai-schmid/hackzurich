var DangerPredictor = /** @class */ (function () {
    function DangerPredictor(directionsService, mapUpdater) {
        this.directionsService = directionsService;
        this.mapUpdater = mapUpdater;
        this.apiCommunicator = new ApiCommunicator();
    }
    DangerPredictor.prototype.hasUpcomingDanger = function (pointIndex, dangers) {
        if (dangers[pointIndex + DangerPredictor.PREDICTION_OVERHEAD] > 1) {
            return true;
        }
        return false;
    };
    DangerPredictor.prototype.getDangersOnRoute = function (data) {
        return this.apiCommunicator.checkDangerForRoute(data);
    };
    DangerPredictor.prototype.calcDistance = function (lat1, lon1, lat2, lon2) {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        return dist;
    };
    DangerPredictor.PREDICTION_OVERHEAD = 10;
    return DangerPredictor;
}());
var Danger = /** @class */ (function () {
    function Danger(dangerType, lat, lng) {
        this.dangerType = dangerType;
        this.lat = lat;
        this.lng = lng;
    }
    return Danger;
}());
var DangerType;
(function (DangerType) {
    DangerType[DangerType["NONE"] = 0] = "NONE";
    DangerType[DangerType["SPEED"] = 1] = "SPEED";
    DangerType[DangerType["VISION"] = 2] = "VISION";
    DangerType[DangerType["STUPIDITY"] = 3] = "STUPIDITY";
})(DangerType || (DangerType = {}));
//# sourceMappingURL=DangerPredictor.js.map