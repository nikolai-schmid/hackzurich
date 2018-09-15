window.onload = () => {
    $("#parametersCloseBtn").click((e) => {
        jQuery.ajax({
            url: "https://jsonplaceholder.typicode.com/todos/1",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function(resultData) {
                alert("got response: " + resultData);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                alert("error, couldn't fetch data")
            },

            timeout: 120000,
        });
    })
}