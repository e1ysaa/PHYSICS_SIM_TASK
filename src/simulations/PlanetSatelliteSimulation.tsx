import { useEffect, useRef, useState } from "react";

/* ================= FORCE INFO BOX ================= */
const ForceBox = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <div
    style={{
      background: "#0f172a",
      padding: "12px 16px",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
      minWidth: "220px",
      borderTop: `4px solid ${color}`,
      color: "white",
    }}
  >
    <div style={{ fontSize: 12, color: "#94a3b8" }}>{title}</div>
    <div
      style={{
        marginTop: 6,
        fontSize: 22,
        fontWeight: 700,
        color,
      }}
    >
      {value.toFixed(5)} N
    </div>
  </div>
);

/* ================= MAIN SIMULATION ================= */
export default function PlanetSatelliteSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [m1, setM1] = useState(4);   // Planet
  const [m2, setM2] = useState(2);   // Satellite
  const [r, setR] = useState(200);

  const G = 10;
  const force = (G * m1 * m2) / (r * r);

  let angle = 0;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const sx = cx + r * Math.cos(angle);
      const sy = cy + r * Math.sin(angle);

      angle += 0.01;

      // Background
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Orbit
      ctx.strokeStyle = "#334155";
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Planet
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fill();

      // Satellite
      ctx.fillStyle = "#e5e7eb";
      ctx.beginPath();
      ctx.arc(sx, sy, 10, 0, Math.PI * 2);
      ctx.fill();

      // Force arrows
      ctx.strokeStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      ctx.strokeStyle = "#60a5fa";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      requestAnimationFrame(animate);
    };

    animate();
  }, [m1, m2, r]);

  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "340px 1fr",
      }}
    >
      {/* ================= LEFT CONTROLS ================= */}
      <div className="panel">
        <h3>Gravity Controls</h3>

        <label>Planet Mass (M₁): {m1}</label>
        <input
          type="range"
          min={1}
          max={10}
          value={m1}
          onChange={(e) => setM1(+e.target.value)}
        />

        <label>Satellite Mass (M₂): {m2}</label>
        <input
          type="range"
          min={1}
          max={10}
          value={m2}
          onChange={(e) => setM2(+e.target.value)}
        />

        <label>Distance (r): {r}</label>
        <input
          type="range"
          min={100}
          max={300}
          value={r}
          onChange={(e) => setR(+e.target.value)}
        />

        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#e0f2fe",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          Notice: Even though the planet is much more massive, the force it feels
            is exactly the same as the force acting on the satellite.

        </div>
      </div>

      {/* ================= RIGHT SIMULATION ================= */}
      <div
        style={{
          position: "relative",
          background: "#020617",
          borderRadius: "16px",
          paddingTop: "90px",
        }}
      >
        {/* FORCE BOXES */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <ForceBox
            title="Force on Satellite (Action)"
            value={force}
            color="#ef4444"
          />
          <div style={{ color: "white", fontSize: 28, fontWeight: 700 }}>
            =
          </div>
          <ForceBox
            title="Force on Planet (Reaction)"
            value={force}
            color="#60a5fa"
          />
        </div>

        {/* CANVAS */}
        <canvas
          ref={canvasRef}
          width={900}
          height={500}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
