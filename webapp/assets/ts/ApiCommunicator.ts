class ApiCommunicator {
    public checkDangerForRoute(data) {
        let dangers = [];

        for (let i = 0; i < data.routes[0].length; i++) {
            if (i === 11) {
                dangers.push(1);
            } else {
                dangers.push(0);
            }
        }

        return dangers;


        jQuery.ajax({
            url: "http://192.168.43.81:5000/predict",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(resultData) {
                console.log(resultData);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log("error, couldn't fetch data");


            },

            timeout: 120000,
        });
    }
}