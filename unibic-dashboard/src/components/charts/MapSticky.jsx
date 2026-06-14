import React from 'react';
import { MAPS, FY_LABELS } from '../../data/defaultData';

export default function MapSticky({ fy, kerala }) {
  return (
    <div className={"mapwrap" + (kerala ? " show-kerala" : "")}>
      <img className="mbase" src={MAPS[0]} alt="GSV FY 23-24" />
      <img className={fy === 1 ? "on" : ""} src={MAPS[1]} alt="GSV FY 24-25" />
      <img className={fy === 2 ? "on" : ""} src={MAPS[2]} alt="GSV FY 25-26" />
      <div className="mtag">{FY_LABELS[fy]}</div>
      <div className="kpin" />
      <div className="knote"><b>+8.2%</b> — Kerala grew while its four neighbours lost ₹26.8 Cr.</div>
    </div>
  );
}