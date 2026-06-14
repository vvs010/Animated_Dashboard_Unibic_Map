import React from 'react';

// seen -> the 35 assortment cells pop in as a cascade
export default function AssortGrid({ seen = true }) {
  return (
    <div className="assort">
      <div className="agrid">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className={"acell" + (i === 0 ? " carried" : "")}
            style={{ opacity: seen ? 1 : 0, transform: seen ? "scale(1)" : "scale(.5)", transition: `opacity .35s ease ${i * 18}ms, transform .4s cubic-bezier(.2,.8,.3,1.4) ${i * 18}ms` }}
          >
            {i === 0 ? "1" : ""}
          </div>
        ))}
      </div>
      <p className="note">1 of 35 brand families available in its market are carried. Sized assortment gap across the region ≈ ₹4.2 Cr.</p>
    </div>
  );
}
