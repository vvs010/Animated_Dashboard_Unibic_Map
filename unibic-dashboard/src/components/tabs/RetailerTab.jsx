import React from 'react';
import { useInView } from '../../hooks/useInView';
import Band from '../layout/Band';
import Scene from '../layout/Scene';
import RetailerProd from '../charts/RetailerProd';
import CityBars from '../charts/CityBars';

// Retailer (outlet) layer — FY 25-26 within-year structure only.
// MC outlet counts are not compared across years (capture expanded); this
// describes the shape of the current network, not a YoY movement.
export default function RetailerTab({ D }) {
  const [s1Ref, s1Seen] = useInView({ threshold: 0.1 });

  return (
    <div className="tab">
      <p className="finding">At the retailer grain, the network is <b>broad but shallow</b>. Tamil Nadu services the
        most outlets (≈20,200) yet sits at the <b>lowest value per outlet</b> of the four states; Karnataka carries
        the most depth. Read as within-year structure for FY 25-26 — outlet counts are not compared across years,
        since market-coverage capture widened.</p>

      <Band no="Retailer · A" title={<>Wide network.<br />Thin bills.</>}>
        Each bubble is a state: outlets serviced across, value per outlet up, bubble size = cases per outlet.
        The biggest networks sit lowest — reach without depth.
      </Band>

      <div ref={s1Ref}>
        <Scene
          sticky={() => (
            <div>
              <div className="ctitle">Outlet productivity · FY 25-26 within-year</div>
              <RetailerProd states={D.retailerState} seen={s1Seen} />
            </div>
          )}
          steps={[
            <><div className="kick">breadth vs depth, by state</div><h3>The widest network is the thinnest.</h3><p>Tamil Nadu reaches ≈20,200 outlets — the most of any state — but earns the least per outlet (₹0.12 L). Breadth has run ahead of depth.</p></>,
            <><div className="kick">Karnataka</div><h3>Fewer outlets, deeper bills.</h3><p>Karnataka services ≈14,100 outlets at ₹0.15 L each and 11.6 cases per outlet — the densest of the four. Depth, not count, separates the states.</p></>,
            <><div className="kick">AP &amp; Telangana</div><h3>AP is the shallowest.</h3><p>Andhra services ≈9,200 outlets at just ₹0.08 L and 6.2 cases each; Telangana, on a far smaller base, runs nearly double AP&rsquo;s depth.</p></>,
          ]}
        />
      </div>

      <Band no="Retailer · B" title="Which cities carry the thinnest drops?">
        The same outlet economics at city grain: the loss centres ranked by rupees lost — the retailer base where
        depth fell away.
      </Band>
      <CityBars region="all" CITIES={D.cities} />
      <p className="note">Outlet productivity here is descriptive of the current network only; it is not differenced
        against prior years. The cross-year movement lives in the Area Zones and South Deep-Dive tabs, which draw on
        the clean sales-invoice series.</p>
    </div>
  );
}
