//Mozgóbér = (Asszisztált szolgáltatás * 13,5% + Asszisztált vas * 3,2%) * marzsin/óra terv teljesítése

import React, { useEffect, useState } from "react";

function App() {
  const [baseSalary, setBaseSalary] = useState(localStorage.getItem("baseSalary") || '');
  const [iron, setIron] = useState({
    current: localStorage.getItem("ironCurrent") || '',
    percentage: 3.2
  });
  const [service, setService] = useState({
    current: localStorage.getItem("serviceCurrent") || '',
    percentage: 13.5
  });
  const [result, setResult] = useState({
    gross: localStorage.getItem("gross") || 0,
    szja: localStorage.getItem("szja") || 0,
    net: localStorage.getItem("net") || 0,
    netszja: localStorage.getItem("netszja") || 0
  });
  const [margin, setMargin] = useState({
    plan: localStorage.getItem("marginPlan") || '',
    current: localStorage.getItem("marginCurrent") || '',
    percentage: localStorage.getItem("marginPercentage") || ''
  });

  const czkValue = 14.5;
  const czkToHuf = czk => czk * czkValue;
  const salesPercentageCalc = sales => {
    if (marginPercentage() < 70) {
      return (sales.current / 2) * sales.percentage / 100
    }

    return sales.current * sales.percentage / 100
  };

  function marginPercentageCheck(percentage) {
    if (percentage > 120) {
      return percentage = 120
    } else if (percentage < 70) {
      return percentage = 70
    }

    return percentage;
  }

  function marginPercentage() {
    const percentage = Math.floor(margin.current / margin.plan * 100);

    margin.percentage = percentage;

    localStorage.setItem("marginPercentage", percentage);

    return percentage;
  }

  function salaryCalc() {
    const net = parseInt(result.gross * (100 - 33.5) / 100);
    const szja = parseInt(result.gross * 15 / 100);

    setResult({
      ...result,
      gross: (
        parseInt(baseSalary)
          + parseInt(czkToHuf((salesPercentageCalc(service) + salesPercentageCalc(iron)) * (marginPercentageCheck(marginPercentage()) / 100)))),
        net: net,
        szja: szja,
        netszja: net + szja
    });
  }

  function formNumber(number) {
    return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '-';
  }

  useEffect(salaryCalc, [
    baseSalary, iron, service, margin,
    result.gross, result.szja, result.net, result.netszja
  ]);
  useEffect(salaryCalc, []);

  return (
    <div className="flex column row--d start-center padding-x-24 padding-y-64 text-center">
      <div className="margin-r-64--d">
        <div className="flex row margin-b-32">
          <label className="margin-b-8">
            Alapbér (bruttó huf)
            <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="265000"
              value={baseSalary}
              onFocus={e => e.currentTarget.select()}
              onChange={e => {
                const value = e.currentTarget.value.replace(/\D/g, "");
                
                setBaseSalary(value);
                localStorage.setItem("baseSalary", value)
              }}
            />
          </label>
        </div>
        <div className="flex column margin-b-32">
          <div className="flex row">
            <label className="margin-l-8">
              Szolgáltatás (elért, czk)
              <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="34000"
                value={service.current}
                onFocus={e => e.currentTarget.select()}
                onChange={e => {
                  const value = e.currentTarget.value.replace(/\D/g, "");
                  
                  setService({ ...service, current: value});
                  localStorage.setItem("serviceCurrent", value)
                }}
              />
            </label>
          </div>
        </div>
        <div className="flex column margin-b-32">
          <div className="flex row">
            <label className="margin-l-8">
              Vas (elért, czk)
              <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="110000"
                value={iron.current}
                onFocus={e => e.currentTarget.select()}
                onChange={e => {
                  const value = e.currentTarget.value.replace(/\D/g, "");
                  
                  setIron({ ...iron, current: value});
                  localStorage.setItem("ironCurrent", value)
                }}
              />
            </label>
          </div>
        </div>
        <div className="group flex column margin-b-32">
          <span className="font-weight-bold margin-b-8">Margin / óra</span>
          <div className="flex row">
            <label className="margin-r-8">
              Terv (czk)
              <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="960"
                value={margin.plan}
                onFocus={e => e.currentTarget.select()}
                onChange={e => {
                  const value = e.currentTarget.value.replace(/\D/g, "");
                  
                  setMargin({ ...margin, plan: value});
                  localStorage.setItem("marginPlan", value)
                }}
              />
            </label>
            <label className="margin-l-8">
              Elért (czk)
              <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="791"
                value={margin.current}
                onFocus={e => e.currentTarget.select()}
                onChange={e => {
                  const value = e.currentTarget.value.replace(/\D/g, "");
                  
                  setMargin({ ...margin, current: value});
                  localStorage.setItem("marginCurrent", value)
                }}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="flex row column--d wrap center sticky top-0 padding-y-32 text-center">
        <div className="width-50--m margin-b-24">
          <span className="block">Bruttó</span>
          <span className="block font-size-24 font-weight-bold">{ formNumber(result.gross) } Ft</span>
        </div>
        <div className="width-50--m margin-b-24">
          <span className="block">SZJA</span>
          <span className="block font-size-24 font-weight-bold">{ formNumber(result.szja) } Ft</span>
        </div>
        <div className="width-50--m margin-b-24">
          <span className="block">Nettó</span>
          <span className="block font-size-24 font-weight-bold">{ formNumber(result.net) } Ft</span>
        </div>
        <div className="width-50--m margin-b-24">
          <span className="block">Nettó + SZJA</span>
          <span className="block font-size-24 font-weight-bold">{ formNumber(result.netszja) } Ft</span>
        </div>
      </div>
    </div>
  );
}

export default App;
