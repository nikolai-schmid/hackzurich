class ApiCommunicator {
    public pingRoute(data) {
        jQuery.ajax({
            url: "http://192.168.43.81:5000/predict",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(resultData) {
                console.log(resultData);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                alert("error, couldn't fetch data")
            },

            timeout: 120000,
        });
    }
}