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
      background: "#fff",
      padding: "12px 16px",
      borderRadius: "12px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
      minWidth: "200px",
      borderTop: `4px solid ${color}`,
    }}
  >
    <div style={{ fontSize: 12, color: "#64748b" }}>{title}</div>
    <div
      style={{
        marginTop: 6,
        fontSize: 22,
        fontWeight: 700,
        color,
      }}
    >
      {Math.abs(value).toFixed(2)} N
    </div>
  </div>
);

/* ================= MAIN SIMULATION ================= */
export default function SpringBlockSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [k, setK] = useState(40);
  const [mass, setMass] = useState(5);
  const [running, setRunning] = useState(false);

  let x = 360;
  let v = 0;
  const equilibrium = 260;

  const displacement = x - equilibrium;
  const force = k * displacement;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (running) {
        const a = (-k * (x - equilibrium)) / mass;
        v += a * 0.05;
        x += v;
        v *= 0.98;
      }

      // wall
      ctx.fillStyle = "#475569";
      ctx.fillRect(40, 220, 20, 80);

      // spring
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(60, 260);
      ctx.lineTo(x, 260);
      ctx.stroke();

      // block
      ctx.fillStyle = "#2563eb";
      ctx.fillRect(x, 230, 60, 60);

      requestAnimationFrame(animate);
    };

    animate();
  }, [running, k, mass]);

  return (
    <div style={{ height: "100%", display: "grid", gridTemplateColumns: "340px 1fr" }}>
      {/* ================= LEFT CONTROLS ================= */}
      <div className="panel">
        <h3>Controls</h3>

        <label>Mass (kg): {mass}</label>
        <input
          type="range"
          min={1}
          max={10}
          value={mass}
          onChange={(e) => setMass(+e.target.value)}
        />

        <label>Spring Constant (k): {k}</label>
        <input
          type="range"
          min={10}
          max={100}
          value={k}
          onChange={(e) => setK(+e.target.value)}
        />

        <button onClick={() => setRunning(true)} style={{ marginTop: 16 }}>
          ▶ START
        </button>
      </div>

      {/* ================= RIGHT SIMULATION ================= */}
      <div
        style={{
          position: "relative",
          background: "#f8fafc",
          borderRadius: "16px",
          paddingTop: "90px",
        }}
      >
        {/* FORCE BOXES (HUD) */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 16,
          }}
        >
          <ForceBox
            title="Force on Block (Action)"
            value={force}
            color="#dc2626"
          />
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 16 }}>=</div>
          <ForceBox
            title="Force on Spring (Reaction)"
            value={-force}
            color="#2563eb"
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
