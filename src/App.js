// ((14% szolgáltatás jutalék + 6% vas jutalék ) * (vas teljesítés % * szolgáltatás teljesítés % + NPS teljesítés %) ) – aktivity = mozgóbér 

import React, { useEffect, useState } from "react";

function App() {
  const [baseSalary, setBaseSalary] = useState(localStorage.getItem("baseSalary") || '');
  const [iron, setIron] = useState({
    plan: localStorage.getItem("ironPlan") || '',
    current: localStorage.getItem("ironCurrent") || '',
    percentage: 6
  });
  const [service, setService] = useState({
    plan: localStorage.getItem("servicePlan") || '',
    current: localStorage.getItem("serviceCurrent") || '',
    percentage: 14
  });
  const [workTime, setWorkTime] = useState({
    plan: localStorage.getItem('workTimePlan') || '',
    current: localStorage.getItem('workTimeCurrent') || ''
  });
  const [activity, setActivity] = useState(localStorage.getItem("activity") || '');
  const [nps, setNps] = useState(localStorage.getItem("nps") || '');
  const [cct, setCct] = useState(localStorage.getItem("cct") || '');
  const [call, setCall] = useState(localStorage.getItem("call") || '');
  const [result, setResult] = useState({
    gross: localStorage.getItem("gross") || 0,
    szja: localStorage.getItem("szja") || 0,
    net: localStorage.getItem("net") || 0,
    netszja: localStorage.getItem("netszja") || 0
  });

  const czkValue = 13;
  const czkToHuf = czk => czk * czkValue;
  const hufToCzk = huf => huf / czkValue;
  const salesCurrentCalc = sales => (sales.current / hufToCzk(sales.plan * workTimeCalc())).toFixed(2);
  const salesPercentageCalc = sales => (sales.current * sales.percentage) / 100;

  const cctCall = current => current * 65;
  const workTimeCalc = () => (workTime.current / workTime.plan).toFixed(2);

  function activityCalc() {
    const plan = 960;
    const penalty = 39;

    return activity < plan ? (plan - activity) * penalty : 0;
  }

  function coefficientCalc() {
    const sales = (salesCurrentCalc(iron) * salesCurrentCalc(service)) * 100;
    const total = sales + npsCalc();

    console.log(sales, total);

    return (sales > 136 ? 136 + npsCalc() : total < 70 ? 70 : total) / 100;
  }

  function npsCalc() {
    let value = 0;

    if (nps <= 4.68 ) {
        value = -4;
    } else if (nps == 4.69) {
        value = -2;
    } else if (nps == 4.7) {
        value = 0;
    } else if (nps == 4.71 || nps == 4.72) {
        value = 2;
    } else if (nps > 4.72) {
        value = 4;
    } else {
        value = 0;
    }

    return value;
  }

  function salaryCalc() {
    const net = parseInt(result.gross * (100 - 33.5) / 100);
    const szja = parseInt(result.gross * 15 / 100);

    setResult({
      ...result,
      gross: (
        parseInt(baseSalary)
          + parseInt(czkToHuf(salesPercentageCalc(service) + salesPercentageCalc(iron)) * coefficientCalc())
        ) - activityCalc() + cctCall(cct) + cctCall(call),
        net: net,
        szja: szja,
        netszja: net + szja
    });
  }

  useEffect(salaryCalc, [
    baseSalary, workTime, iron, service, activity, nps, call, cct,
    result.gross, result.szja, result.net, result.netszja
  ]);
  useEffect(salaryCalc, []);

  return (
    <div className="flex column row--d center padding-x-24 padding-y-64 text-center">
      <div className="margin-r-64--d">
        <div className="flex row margin-b-32">
          <label className="margin-b-8">
            Alapbér (bruttó huf)
            <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="265000"
              value={baseSalary}
              onFocus={e => e.currentTarget.select()}
              onChange={e => { setBaseSalary(e.currentTarget.value); localStorage.setItem("baseSalary", e.currentTarget.value) }}
            />
          </label>
        </div>
        <div className="group flex column margin-b-32">
          <span className="font-weight-bold margin-b-8">Munkaidő (óra)</span>
          <div className="flex row">
            <label className="margin-r-8">
              Tervezett
              <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="161"
                value={workTime.plan}
                onFocus={e => e.currentTarget.select()}
                onChange={e => { setWorkTime({ ...workTime, plan: e.currentTarget.value}); localStorage.setItem("workTimePlan", e.currentTarget.value) }}
              />
            </label>
            <label className="margin-l-8">
              Ledolgozott
              <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="161"
                value={workTime.current}
                onFocus={e => e.currentTarget.select()}
                onChange={e => { setWorkTime({ ...workTime, current: e.currentTarget.value}); localStorage.setItem("workTimeCurrent", e.currentTarget.value)}}
              />
            </label>
          </div>
        </div>
        <div className="group flex column margin-b-32">
          <span className="font-weight-bold margin-b-8">Szolgáltatás</span>
          <div className="flex row">
            <label className="margin-r-8">
              Terv (huf)
              <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="507500"
                value={service.plan}
                onFocus={e => e.currentTarget.select()}
                onChange={e => { setService({ ...service, plan: e.currentTarget.value}); localStorage.setItem("servicePlan", e.currentTarget.value) }}
              />
            </label>
            <label className="margin-l-8">
              Elért (czk)
              <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="34000"
                value={service.current}
                onFocus={e => e.currentTarget.select()}
                onChange={e => { setService({ ...service, current: e.currentTarget.value}); localStorage.setItem("serviceCurrent", e.currentTarget.value)}}
              />
            </label>
          </div>
        </div>
        <div className="group flex column margin-b-32">
          <span className="font-weight-bold margin-b-8">Vas</span>
          <div className="flex row">
            <label className="margin-r-8">
              Terv (huf)
              <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="1450000"
                value={iron.plan}
                onFocus={e => e.currentTarget.select()}
                onChange={e => { setIron({ ...iron, plan: e.currentTarget.value}); localStorage.setItem("ironPlan", e.currentTarget.value)}}
              />
            </label>
            <label className="margin-l-8">
              Elért (czk)
              <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="110000"
                value={iron.current}
                onFocus={e => e.currentTarget.select()}
                onChange={e => { setIron({ ...iron, current: e.currentTarget.value}); localStorage.setItem("ironCurrent", e.currentTarget.value)}}
              />
            </label>
          </div>
        </div>
        <div className="flex row margin-b-32">
          <label className="margin-r-8">
            Aktivity (pont)
            <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="960"
              value={activity}
              onFocus={e => e.currentTarget.select()}
              onChange={e => { setActivity(e.currentTarget.value); localStorage.setItem("activity", e.currentTarget.value)}}
            />
          </label>
          <label className="margin-l-8">
            NPS (pont)
            <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="decimal" placeholder="4.71"
              value={nps}
              onFocus={e => e.currentTarget.select()}
              onChange={e => { setNps(e.currentTarget.value); localStorage.setItem("nps", e.currentTarget.value)}}
            />
          </label>
        </div>
        <div className="flex row margin-b-32">
          <label className="margin-r-8">
            CCT (db)
            <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="0"
              value={cct}
              onFocus={e => e.currentTarget.select()}
              onChange={e => { setCct(e.currentTarget.value); localStorage.setItem("cct", e.currentTarget.value)}}
            />
          </label>
          <label className="margin-l-8">
            Call (db)
            <input className="text-center margin-t-4" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="0"
              value={call}
              onFocus={e => e.currentTarget.select()}
              onChange={e => { setCall(e.currentTarget.value); localStorage.setItem("call", e.currentTarget.value)}}
            />
          </label>
        </div>
      </div>
      <div className="flex row column--d wrap center sticky top-0 padding-y-32 text-center">
        <div className="width-50--m margin-b-24">
          <span className="block">Bruttó</span>
          <span className="block font-size-24 font-weight-bold">{ result.gross } Ft</span>
        </div>
        <div className="width-50--m margin-b-24">
          <span className="block">SZJA</span>
          <span className="block font-size-24 font-weight-bold">{ result.szja } Ft</span>
        </div>
        <div className="width-50--m margin-b-24">
          <span className="block">Nettó</span>
          <span className="block font-size-24 font-weight-bold">{ result.net } Ft</span>
        </div>
        <div className="width-50--m margin-b-24">
          <span className="block">Nettó + SZJA</span>
          <span className="block font-size-24 font-weight-bold">{ result.netszja } Ft</span>
        </div>
      </div>
    </div>
  );
}

export default App;
