// SA:
// Szolgáltatás: 11.25%
// Vas: 2.67%
// Kasszához pluszban:
// 82HUF / db

// Call
// Szolgáltatás: 10%
// Vas: 2%

// Képlet: (szolgáltatás + vas) * m/h * s/h

// m/h:
// < 70% = 0
// >= 120% = 1.2

// s/h:
// < 100% = 0.7
// >= 100% = 1.2

import React, { useEffect, useState } from "react";

function App() {
  const [baseSalary, setBaseSalary] = useState({
    standard: 385000,
    senior: 410000
  });
  const [overtimeHours, setOvertimeHours] = useState(parseInt(localStorage.getItem("overtimeHours")) || 0);
  const [travel, setTravel] = useState(14400);
  const [isSenior, setIsSenior] = useState(localStorage.getItem("isSenior") === "true");
  const [isShCompleted, setIsShCompleted] = useState(localStorage.getItem("isShCompleted") === "true");
  const [isUnder25, setIsUnder25] = useState(localStorage.getItem("isUnder25") === "true");
  const [isCalling, setIsCalling] = useState(localStorage.getItem("isCalling") === "true");

  const [marginPerHour, setMarginPerHour] = useState(parseInt(localStorage.getItem("marginPerHour")) || 0);

  const [iron, setIron] = useState({
    curr: parseInt(localStorage.getItem("ironCurrent")) || 0,
    pos: {
      ss: 2.67, // Sales Specialist
      call: 2.6 // Call Specialist
    }
  });

  const [service, setService] = useState({
    curr: parseInt(localStorage.getItem("serviceCurrent")) || 0,
    pos: {
      ss: 11.25 , // Sales Specialist
      call: 9 // Call Specialist
    }
  });

  const [result, setResult] = useState({});

  const czkValue = 16.5;
  const czkToHuf = czk => czk * czkValue;

  const calcIronAndService = (servicePercent, ironPercent) => {
    function calcPercentage(current, percent) {
      return current * (percent / 100);
    }

    const ironCalc = calcPercentage(iron.curr, ironPercent);
    const serviceCalc = calcPercentage(service.curr, servicePercent);
    
    return parseInt(ironCalc + serviceCalc);
  };

  function calcMarginPerHour() {
    const curr = marginPerHour / 100;
    // minimum and maximum requirements
    const req = {
      min: 0.7,
      max: 1.2
    };

    // minimum and maximum multiplier
    const mult = {
      min: 0,
      max: 1.2
    };

    // m/h < 70% = 0
    if (curr < req.min ) { return mult.min; }

    // m/h is between 70 and 120 percent = 0
    if (curr >= req.min && curr < req.max) { return curr; }

    // m/h >= 120% = 1.2
    if (curr >= req.max) { return mult.max; }
  }

  function calcSZJA(number) {
    const maxSZJA = 74993;

    return number > maxSZJA ? maxSZJA : number;
  }

  function calcNet(gross) {
    return parseInt(gross * (100 - 33.5) / 100)
  }

  function calcOvertime(base, hour = 0) {
    return parseInt((base / 168 * 1.5) * hour) || 0;
  }

  function salaryCalc() {
    const base = !isSenior ? baseSalary["standard"] : baseSalary["senior"];
    const ironAndService = !isCalling ? calcIronAndService(service.pos.ss, iron.pos.ss) : calcIronAndService(service.pos.call, iron.pos.call);
    const mh = calcMarginPerHour();
    const sh = isShCompleted ? 1.2 : 0.7;
    const commission = parseInt(czkToHuf(ironAndService) * mh * sh);
    const overtime = calcOvertime(base, overtimeHours);
    const szja = calcSZJA(parseInt((base + travel + commission) * 15 / 100));
    const sum = base + travel + commission + overtime; 
    const sumGross = sum + (isUnder25 ? szja : 0);

    setResult({
      base,
      commission,
      travel,
      szja,
      sumGross,
      overtime,
      sumNet: calcNet(sumGross)
    });

    localStorage.setItem("overtimeHours", overtimeHours);
    localStorage.setItem("marginPerHour", marginPerHour);
    localStorage.setItem("isSenior", isSenior);
    localStorage.setItem("isCalling", isCalling);
    localStorage.setItem("isShCompleted", isShCompleted);
    localStorage.setItem("isUnder25", isUnder25);
    localStorage.setItem("ironCurrent", iron.curr);
    localStorage.setItem("serviceCurrent", service.curr);
  }

  function formatNumber(number) {
    return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : '';
  }

  function clearNumber(number) {
    return parseInt(number.toString().replace(/[%,. Kčóra]/gi, ""));
  }

  function clearFloat(number) {
    return parseFloat(number.toString().replace(/[% Kčóra]/gi, ""));
  }

  function removeNumber(number) {
    return parseInt(clearNumber(number).toString().replace(/\d$/, "")) || 0;
  }

  function moveCursorToTheEnd(e) {
    const lastChar = e.target.value.length;

    e.target.setSelectionRange(lastChar, lastChar);
    e.target.focus();
  }

  useEffect(salaryCalc, [ baseSalary, marginPerHour, overtimeHours, isCalling, isSenior, isShCompleted, isUnder25, iron.curr, service.curr ]);
  useEffect(salaryCalc, []);

  return (
    <div className="padding-24 padding-t-48--d flex--d column--d center-between--d height-min-100vh--d">
      <div className="flex column start-center--d row--d width-100">
        <div className="width-100 width-text--d margin-r-56--d">
          <h1 className="font-size-48 margin-b-40">Alza <br />Bérszámoló</h1>
          <section className="margin-b-24">
            <h2 className="font-size-16 margin-b-16">Alapok</h2>
            <label className="relative margin-b-8 flex cursor-text">
              <input type="text" pattern="[0-9]*" inputMode="numeric" placeholder="0 Kč"
                value={`${formatNumber(service.curr)}${clearNumber(service.curr) ? ' Kč' : ''}`}
                onClick={moveCursorToTheEnd}
                onChange={e => {
                  if (e.nativeEvent.inputType === "deleteContentBackward") {
                    setService({
                      ...service,
                      curr: removeNumber(e.target.value)
                    })
                  } else {
                    setService({
                      ...service,
                      curr: clearNumber(e.target.value)
                    })
                  }
                }}
              />
              <span>Szolgáltatás</span>
            </label>
            <label className="relative margin-b-8 flex cursor-text">
              <input type="text" pattern="[0-9]*" inputMode="numeric" placeholder="0 Kč"
                value={`${formatNumber(iron.curr)}${clearNumber(iron.curr) ? ' Kč' : ''}`}
                onClick={moveCursorToTheEnd}
                onChange={e => {
                  if (e.nativeEvent.inputType === "deleteContentBackward") {
                    setIron({
                      ...iron,
                      curr: removeNumber(e.target.value)
                    })
                  } else {
                    setIron({
                      ...iron,
                      curr: clearNumber(e.target.value)
                    })
                  }
                }}
              />
              <span>Vas</span>
            </label>
            <label className="relative margin-b-8 flex cursor-text">
              <input type="text" pattern="[0-9]*" inputMode="numeric" placeholder="0 %"
                value={`${formatNumber(marginPerHour)}${clearFloat(marginPerHour) ? ' %' : ''}`}
                onClick={moveCursorToTheEnd}
                onChange={e => {
                  if (e.nativeEvent.inputType === "deleteContentBackward") {
                    setMarginPerHour(removeNumber(e.target.value))
                  } else {
                    setMarginPerHour(clearFloat(e.target.value))
                  }
                }}
              />
              <span>M/h</span>
            </label>
            <label className="relative margin-b-8 flex cursor-text">
              <input type="text" pattern="[0-9]*" inputMode="numeric" placeholder="0 óra"
                value={`${formatNumber(overtimeHours)}${clearNumber(overtimeHours) ? ' óra' : ''}`}
                onClick={moveCursorToTheEnd}
                onChange={e => {
                  if (e.nativeEvent.inputType === "deleteContentBackward") {
                    setOvertimeHours(removeNumber(e.target.value))
                  } else {
                    setOvertimeHours(clearNumber(e.target.value))
                  }
                }}
              />
              <span>Túlóra</span>
            </label>
          </section>
          <section className="margin-b-40--m">
            <h2 className="font-size-16 margin-b-8">Opciók</h2>
            <div className="inline-flex column">
              <label className="flex center-start padding-y-8 cursor-pointer">
                <input type="checkbox"
                  checked={isShCompleted}
                  onChange={e => setIsShCompleted(prev => !prev)}
                />
                <div className="checkbox"></div>
                <span>S/h teljesítve</span>
              </label>
              <label className="flex center-start padding-y-8 cursor-pointer">
                <input type="checkbox"
                  checked={isSenior}
                  onChange={e => setIsSenior(prev => !prev)}
                />
                <div className="checkbox"></div>
                <span>Senior vagyok</span>
              </label>
              <label className="flex center-start padding-y-8 cursor-pointer">
                <input type="checkbox"
                  checked={isUnder25}
                  onChange={e => setIsUnder25(prev => !prev)}
                />
                <div className="checkbox"></div>
                <span>25 év alatti vagyok</span>
              </label>
              <label className="flex center-start padding-y-8 cursor-pointer">
                <input type="checkbox"
                  checked={isCalling}
                  onChange={e => setIsCalling(prev => !prev)}
                />
                <div className="checkbox"></div>
                <span>Callozok</span>
              </label>
            </div>
          </section>
        </div>
        <section className="summary width-100 width-text--d margin-t-192--d">
          <div className="flex justify-between margin-b-8">
            <span>Alapbér</span>
            <div className="">
              <span>{formatNumber(result.base)}</span>
              <span> Ft</span>
            </div>
          </div>
          <div className="flex justify-between margin-b-8">
            <span>Jutalék</span>
            <div className="">
              <span>{formatNumber(result.commission) || 0}</span>
              <span> Ft</span>
            </div>
          </div>
          <div className="flex justify-between margin-b-8">
            <span>Utazási költség</span>
            <div className="">
              <span>{formatNumber(result.travel)}</span>
              <span> Ft</span>
            </div>
          </div>
          { overtimeHours ? <div className="flex justify-between margin-b-8">
            <span>Túlóra</span>
            <div className="">
              <span>{formatNumber(result.overtime)}</span>
              <span> Ft</span>
            </div>
          </div> : '' }
          { isUnder25 ? <div className="flex justify-between">
            <span>Kedvezményes SZJA</span>
            <div className="">
              <span>{formatNumber(result.szja)}</span>
              <span> Ft</span>
            </div>
          </div> : '' }
          <div className="flex justify-between font-size-16 margin-t-24 margin-b-8">
            <span>Összesen:</span>
            <div className="">
              <span>{formatNumber(result.sumGross)}</span>
              <span> Ft</span>
            </div>
          </div>
          <div className="flex justify-between color-white font-size-24">
            <span>Nettó:</span>
            <div className="">
              <span>{formatNumber(result.sumNet)}</span>
              <span> Ft</span>
            </div>
          </div>
        </section>
      </div>
      <footer className="width-100 width-content">
        <div className="margin-b-16">
          <span className="block">Design by rlndsgn</span>
          <span className="block">Coded by jezstdio</span>
        </div>
        <span className="block">Copyright © 2023. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default App;
