import React from 'react'

const ParticleBackground = () => {
  return (
    <div className="neo-bg" style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 1,
    }}>
      {/* Gradient mesh blobs */}
      <div className="neo-blob neo-blob-1" />
      <div className="neo-blob neo-blob-2" />
      <div className="neo-blob neo-blob-3" />
      <div className="neo-blob neo-blob-4" />
      <div className="neo-blob neo-blob-5" />

      {/* Radial glow center */}
      <div className="neo-radial-glow" />

      {/* Grid overlay */}
      <div className="neo-grid-overlay" />

      <style>{`
        .neo-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          will-change: transform;
        }

        .neo-blob-1 {
          width: 600px;
          height: 600px;
          top: -15%;
          left: -10%;
          background: radial-gradient(circle, rgba(26, 111, 181, 0.6) 0%, rgba(42, 157, 143, 0.3) 50%, transparent 70%);
          animation: neoBlob1 20s ease-in-out infinite;
        }

        .neo-blob-2 {
          width: 500px;
          height: 500px;
          top: 20%;
          right: -5%;
          background: radial-gradient(circle, rgba(201, 168, 76, 0.5) 0%, rgba(26, 111, 181, 0.2) 50%, transparent 70%);
          animation: neoBlob2 25s ease-in-out infinite;
        }

        .neo-blob-3 {
          width: 400px;
          height: 400px;
          bottom: -10%;
          left: 30%;
          background: radial-gradient(circle, rgba(42, 157, 143, 0.5) 0%, rgba(201, 168, 76, 0.2) 50%, transparent 70%);
          animation: neoBlob3 22s ease-in-out infinite;
        }

        .neo-blob-4 {
          width: 350px;
          height: 350px;
          top: 50%;
          left: 15%;
          background: radial-gradient(circle, rgba(26, 111, 181, 0.4) 0%, transparent 60%);
          animation: neoBlob4 18s ease-in-out infinite;
        }

        .neo-blob-5 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 45%;
          background: radial-gradient(circle, rgba(201, 168, 76, 0.3) 0%, transparent 60%);
          animation: neoBlob5 28s ease-in-out infinite;
        }

        .neo-radial-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%);
          animation: neoRadialPulse 8s ease-in-out infinite;
        }

        .neo-grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.5;
        }

        [data-theme="dark"] .neo-blob { opacity: 0.35; }
        [data-theme="dark"] .neo-grid-overlay { opacity: 0.3; }

        @keyframes neoBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(80px, 60px) scale(1.1); }
          50% { transform: translate(30px, 120px) scale(0.95); }
          75% { transform: translate(-40px, 40px) scale(1.05); }
        }

        @keyframes neoBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-100px, 50px) scale(1.15); }
          50% { transform: translate(-60px, -80px) scale(0.9); }
          75% { transform: translate(30px, -30px) scale(1.08); }
        }

        @keyframes neoBlob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(60px, -70px) scale(1.1); }
          50% { transform: translate(-50px, -40px) scale(1.2); }
          75% { transform: translate(80px, 20px) scale(0.95); }
        }

        @keyframes neoBlob4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, -60px) scale(1.3); }
          66% { transform: translate(-60px, 80px) scale(0.85); }
        }

        @keyframes neoBlob5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-80px, 100px) scale(1.15); }
          50% { transform: translate(70px, 50px) scale(0.9); }
          75% { transform: translate(20px, -80px) scale(1.1); }
        }

        @keyframes neoRadialPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

export default ParticleBackground
