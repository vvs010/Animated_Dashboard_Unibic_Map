import React from 'react';

export default function Band({ no, title, children }) {
  return (
    <section className="band">
      <div className="bno">{no}</div>
      <h2 className="bh">{title}</h2>
      <p className="bp">{children}</p>
    </section>
  );
}