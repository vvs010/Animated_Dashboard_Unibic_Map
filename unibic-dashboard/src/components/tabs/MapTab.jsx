import React, { useState, useMemo } from 'react';
import Band from '../layout/Band';
import SouthMap from '../charts/SouthMap';
import MapDrill from '../charts/MapDrill';
import { STATE_DEFS, buildCityCards, buildStateCard } from '../../data/mapData';

export default function MapTab({ D }) {
  const [activeState, setActiveState] = useState(null);
  const [activeCity, setActiveCity] = useState(null);

  const cityCards = useMemo(() => buildCityCards(D), [D]);
  const stateDef = STATE_DEFS.find((s) => s.k === activeState) || null;
  const stateCard = useMemo(() => (stateDef ? buildStateCard(D, stateDef) : null), [D, stateDef]);
  const cityCard = activeCity ? cityCards[activeCity] : null;

  const cardOf = useMemo(() => ({
    city: (n) => cityCards[n] || null,
    state: (def) => buildStateCard(D, def),
  }), [cityCards, D]);

  return (
    <div className="tab">
      <p className="finding">An interactive map of the four southern states under investigation — <b>Tamil Nadu,
        Karnataka, Andhra Pradesh and Telangana</b> (Kerala shown faded, as the +8.2% growth benchmark). Tap a
        state to zoom in and reveal its cities; tap any point to drill into the problems and gaps identified there.</p>

      <Band no="Map · interactive" title="The South, point by point.">
        Point size grows with GSV lost. Flagged cities are filled in their state colour; quieter cities sit grey.
        Everything here is investigation — the figures join the same notebook datasets used across the dashboard.
      </Band>

      <SouthMap
        activeState={activeState}
        activeCity={activeCity}
        onState={setActiveState}
        onCity={setActiveCity}
        cardOf={cardOf}
      />

      <MapDrill
        stateDef={stateDef}
        stateCard={stateCard}
        cityName={activeCity}
        cityCard={cityCard}
      />
    </div>
  );
}
