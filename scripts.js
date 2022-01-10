function limitMaxScore(currentScore, maxScore) {
    if (currentScore > maxScore) {
        return currentScore -= currentScore - maxScore;
    }

    return currentScore;
}

function service() {
    const value = window.prompt("Szolgáltatások forintban");
    const variable = 13.5;

    return value / 100 * variable;
}

function iron() {
    const value = window.prompt("Vas forintban");
    const variable = 3.2;

    return value / 100 * variable;
}

function activity() {
    const targetScore = 960;
    const maxScore = targetScore * 2;
    const gross = 14625;
    const variable = 39;
    let currentScore = limitMaxScore(window.prompt("Aktivity pontszám"), maxScore);

    return ((currentScore - targetScore) * variable) + gross;
}

function nps() {
    const targetScore = 4.7;
    const maxScore = 4.76;
    const gross = 13000;
    const variable = 100;
    let currentScore = limitMaxScore(window.prompt("NPS pontszám"), maxScore);

    return (Math.round((currentScore - targetScore) * 100) * variable) + gross;
}

document.write(Math.round(265000 + service() + iron() + activity() + nps()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " Ft");

// Show, that the given values are in gross.
// Make inputs instead of prompts.
// CZK to HUF converter.
// Gross to net converter.