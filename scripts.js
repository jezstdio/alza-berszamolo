const serviceInput = document.getElementById("service");
const ironInput = document.getElementById("iron");
const activityInput = document.getElementById("activity");
const npsInput = document.getElementById("nps");
const defaultGross = 265000;

function limitMaxScore(currentScore, maxScore) {
    if (currentScore > maxScore) {
        return currentScore -= currentScore - maxScore;
    }

    return currentScore;
}

function service() {
    const value = serviceInput.value;
    const variable = 13.5;

    return value / 100 * variable;
}

function iron() {
    const value = ironInput.value;
    const variable = 3.2;

    return value / 100 * variable;
}

function activity() {
    const targetScore = 960;
    const maxScore = targetScore * 2;
    const gross = 14625;
    const variable = 39;
    let currentScore = limitMaxScore(activityInput.value, maxScore);

    return ((currentScore - targetScore) * variable) + gross;
}

function nps() {
    const targetScore = 4.7;
    const maxScore = 4.76;
    const gross = 13000;
    const variable = 100;
    let currentScore = limitMaxScore(npsInput.value.replace(",", "."), maxScore);

    return (Math.round((currentScore - targetScore) * 100) * variable) + gross;
}

function showGross() {
    const sum = document.getElementById("sum");
    
    sum.innerHTML = Math.round(defaultGross + service() + iron() + activity() + nps()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " Ft (brutto)";
}

serviceInput.onkeyup = showGross;
ironInput.onkeyup = showGross;
activityInput.onkeyup = showGross;
npsInput.onkeyup = showGross;

// CZK to HUF converter.
// Gross to net converter.