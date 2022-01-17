const serviceInput = document.getElementById("service");
const ironInput = document.getElementById("iron");
const activityInput = document.getElementById("activity");
const npsInput = document.getElementById("nps");
const baseSalarySelect = document.getElementById("base_salary--select");
const baseSalaryInput = document.getElementById("base_salary--input");
let defaultGross = 265000;

function inputCheck(value) {
    return parseInt(value.toString().replace(/\s/g, "").trim()) || 0;
}

function limitMaxScore(currentScore, maxScore) {
    if (currentScore > maxScore) {
        return currentScore -= currentScore - maxScore;
    }

    return currentScore;
}

function showGross() {
    const sum = document.getElementById("sum");
    
    sum.innerHTML = Math.round(defaultGross + service() + iron() + activity() + nps()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " Ft";
    console.log(defaultGross, service(), iron(), activity(), nps());
}

function czkToHuf(czk) {
    const variable = 15;

    return czk * variable;
}

function service() {
    const value = inputCheck(serviceInput.value);
    const variable = 13.5;

    return czkToHuf(value / 100 * variable);
}

function iron() {
    const value = inputCheck(ironInput.value);
    const variable = 3.2;

    return czkToHuf(value / 100 * variable);
}

function activity() {
    const targetScore = 960;
    const maxScore = targetScore * 2;
    const gross = 14625;
    const variable = 39;
    let currentScore = limitMaxScore(inputCheck(activityInput.value), maxScore);

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

serviceInput.onkeyup = showGross;
ironInput.onkeyup = showGross;
activityInput.onkeyup = showGross;
npsInput.onkeyup = showGross;
baseSalaryInput.onkeyup = e => {
    defaultGross = inputCheck(e.currentTarget.value);
    showGross(e);
}

serviceInput.onfocus = e => e.currentTarget.select();
ironInput.onfocus = e => e.currentTarget.select();
activityInput.onfocus = e => e.currentTarget.select();
npsInput.onfocus = e => e.currentTarget.select();
baseSalaryInput.onfocus = e => e.currentTarget.select();

baseSalarySelect.onchange = e => {
    if (e.currentTarget.value === "personal") {
        baseSalaryInput.classList.remove("none");
        if (!baseSalaryInput.value) {
            baseSalaryInput.value = defaultGross;
        } else {
            defaultGross = inputCheck(baseSalaryInput.value);
        }
    } else {
        baseSalaryInput.classList.add("none");
        defaultGross = inputCheck(e.currentTarget.value);
    }

    showGross(e);
}

// Gross to net converter.