let currentTemp = 0;
let isOn = false;
let tempLog = [];
let powerLog = [];
let powerUsage = 0;
let interval;
let logInterval;

document.getElementById('startButton').addEventListener('click', toggleBoiler);

function toggleBoiler() {
    const inputTemp = parseInt(document.getElementById('temperature').value);
    if (!isNaN(inputTemp) && inputTemp >= 0 && inputTemp <= 100) {
        currentTemp = inputTemp;
        document.getElementById('currentTemp').textContent = `Aktuális hőfok: ${currentTemp}°C`;
        if (!isOn) {
            startBoiler();
        } else {
            stopBoiler();
        }
    } else {
        alert('Adj meg egy érvényes hőfokot (0-100 °C)!');
    }
}

function startBoiler() {
    isOn = true;
    document.getElementById('status').textContent = 'Állapot: Bekapcsolva';
    document.getElementById('startButton').textContent = 'Forraló Kikapcsolása';
    interval = setInterval(heatWater, 4000);
    logInterval = setInterval(logData, 60000); // Adatrögzítés percenként
}

function stopBoiler() {
    isOn = false;
    document.getElementById('status').textContent = 'Állapot: Kikapcsolva';
    document.getElementById('startButton').textContent = 'Forraló Bekapcsolása';
    clearInterval(interval);
    coolWater();
}

function heatWater() {
    if (currentTemp < 100) {
        currentTemp += 1;
        powerUsage += 0.05; // Például 0.05 kW minden egyes melegítési ciklus alatt
        document.getElementById('currentTemp').textContent = `Aktuális hőfok: ${currentTemp}°C`;
        document.getElementById('powerConsumption').textContent = `Fogyasztás: ${powerUsage.toFixed(2)} kW`;
    } else {
        stopBoiler();
    }
}

function coolWater() {
    clearInterval(logInterval); // Adatrögzítést befejezzük
    logInterval = setInterval(() => {
        if (currentTemp > 80) {
            currentTemp -= 10;
        } else if (currentTemp > 50) {
            currentTemp -= 5;
        } else if (currentTemp > 18) {
            currentTemp -= 2;
        } else {
            currentTemp = 18; // Rezsitakarékos hőmérséklet
            clearInterval(logInterval);
        }
        document.getElementById('currentTemp').textContent = `Aktuális hőfok: ${currentTemp}°C`;
        logData();
    }, 60000); // 1 perces intervallum
}

function logData() {
    tempLog.push(currentTemp);
    powerLog.push(powerUsage);
    updateLogDisplay();
}

function updateLogDisplay() {
    const dataElement = document.getElementById('data');
    let logString = '';
    for (let i = 0; i < tempLog.length; i++) {
        logString += `Hőmérséklet: ${tempLog[i]}°C, Fogyasztás: ${powerLog[i].toFixed(2)} kW `;
        if ((i + 1) % 10 === 0) {
            logString += '<br>';
        }
    }
    dataElement.innerHTML = logString;
}