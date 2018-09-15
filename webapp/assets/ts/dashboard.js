window.onload = () => {
    $("#parametersCloseBtn").click((e) => {
        generate(buildData());
    })
}

async function generate(data) {
    jQuery.ajax({
        url: "http://192.168.43.81:5000/html_plot",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: function(resultData) {
            let iframe = $("iframe").get(0);
            iframe.src = iframe.src;
        },
        error : function(jqXHR, textStatus, errorThrown) {
            alert("error, couldn't fetch data")
        },

        timeout: 120000,
    });
}

function buildData() {
    let age = parseInt($("#age-input").val());
    let time = parseInt($("#time-select").find(":selected").val());
    let vehicle = parseInt($("#vehicle-state-select").find(":selected").val());
    let gender = parseInt($("#gender-select").find(":selected").val());
    let weather = parseInt($("#weather-select").find(":selected").val());

    return {
        x1: 47.342,
        y1:  8.44,
        x2: 47.469,
        y2: 8.57,
        persona: {
            time: time,
            age: age,
            vehicle: vehicle,
            weather: weather,
            sex: gender
        }
    }
}