import React, { useState } from 'react';
import SpringBlockSimulation from './simulations/SpringBlockSimulation';
import PlanetSatelliteSimulation from './simulations/PlanetSatelliteSimulation';

const App = () => {
  const [active, setActive] = useState<'spring' | 'planet'>('spring');

  return (
    <div style={{ height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* HEADER */}
      <header
        style={{
          height: '64px',
          background: '#0f172a',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <h1 style={{ fontSize: '18px', fontWeight: 600 }}>
          Physics Simulations — Newton's Third Law
        </h1>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActive('spring')}
            style={tabStyle(active === 'spring')}
          >
            Contact Force
          </button>
          <button
            onClick={() => setActive('planet')}
            style={tabStyle(active === 'planet')}
          >
            Non-contact Force
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          height: 'calc(100vh - 64px)',
          padding: '24px',
          background: '#f1f5f9',
        }}
      >
        {active === 'spring' && <SpringBlockSimulation />}
        {active === 'planet' && <PlanetSatelliteSimulation />}
      </main>
    </div>
  );
};

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 500,
  background: active ? '#3b82f6' : '#1e293b',
  color: 'white',
});

export default App;

