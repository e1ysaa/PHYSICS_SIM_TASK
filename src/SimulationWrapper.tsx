import React from 'react';
import { SpringBlockSimulation, PlanetSatelliteSimulation } from './simulations';

const SimulationWrapper = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px' }}>
      <div>
        <h2>Example 1: Contact Force</h2>
        <SpringBlockSimulation />
      </div>
      <div>
        <h2>Example 2: Non-contact Force</h2>
        <PlanetSatelliteSimulation />
      </div>
    </div>
  );
};

export default SimulationWrapper;
