// API keys and Channel ID
const ts_channel_id = 2694167;
const lightOnApiKey = "C1GVPZ4XPDZICES6";
const lightOffApiKey = "ZFLCJT4LWWZJ5ODH";

// Add event listeners for light control
document.getElementById('light-on').addEventListener('click', () => updateLightState(lightOnApiKey, 1));
document.getElementById('light-off').addEventListener('click', () => updateLightState(lightOffApiKey, 0));

// Update light state on ThingSpeak
function updateLightState(apiKey, state) {
    const url = `http://api.thingspeak.com/update?api_key=${apiKey}&field6=${state}`;
    $.getJSON(url, data => console.log(data));
}

// Fetch data every 15 seconds
setInterval(() => {
    fetchThingSpeakData(6, "LIGHTState", state => state == 1 ? "ON" : "OFF");
    fetchThingSpeakData(1, "rainState");
    fetchThingSpeakData(2, "tempState", temp => {
        const fahrenheit = (temp * 9/5) + 32;
        return fahrenheit.toFixed(1) + "°F";
    });
    fetchThingSpeakData(3, "ldrState", value => {
        const element = document.getElementById('ldrState');
        let lightLevel;
        
        if (value > 800) {
            lightLevel = "Very High";
            element.classList.add('very-high-value');
            element.classList.remove('high-value', 'normal-value');
        } else if (value > 500) {
            lightLevel = "High";
            element.classList.add('high-value');
            element.classList.remove('very-high-value', 'normal-value');
        } else {
            lightLevel = "Normal";
            element.classList.add('normal-value');
            element.classList.remove('very-high-value', 'high-value');
        }
        
        return `${value} (${lightLevel})`;
    });
    fetchThingSpeakData(4, "distanceState");
    fetchThingSpeakData(5, "waterspeedState");
}, 15000);

// Generic function to fetch and update data from ThingSpeak
function fetchThingSpeakData(field, elementId, transform = value => value) {
    const url = `https://api.thingspeak.com/channels/${ts_channel_id}/fields/${field}/last.json`;
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const data = JSON.parse(this.responseText);
            document.getElementById(elementId).innerHTML = transform(data[`field${field}`]);
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}