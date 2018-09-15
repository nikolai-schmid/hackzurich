class ApiCommunicator {
    async public checkDangerForRoute(data) {
        jQuery.ajax({
            url: "http://192.168.43.81:5000/predict",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(resultData) {
                console.log(resultData);
                return resultData;
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log("error, couldn't fetch data");
            },

            timeout: 120000,
        });
    }
}