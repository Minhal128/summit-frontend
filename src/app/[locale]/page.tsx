export default function Home() {
  return (
    <>
      <main className="poster-page">
        <div className="poster">
          <div className="content">
            <p className="eyebrow">Exclusive Access</p>
            <h1 className="headline-red">Pay Us &amp;</h1>
            <h1 className="headline-white">Get the Code</h1>
            <div className="divider"></div>

            <p className="wallet-label">Send 10,000$ Payment To</p>
            <div className="wallet-box">
              <p className="wallet-network">TRC-20 · TRON Wallet</p>
              <p className="wallet-address">TMCgV7beYjuRsiQNPgPhK6FxCBwjhrN4HE</p>
            </div>

            <div className="steps">
              <div className="step">
                <div className="step-number">01</div>
                <div className="step-label">Send payment</div>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="step-number">02</div>
                <div className="step-label">DM proof</div>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="step-number">03</div>
                <div className="step-label">Receive code</div>
              </div>
            </div>

            <p className="footer">Production-grade · Clean code · Instant delivery</p>
          </div>
        </div>
      </main>

      <style>{`
        .poster-page,
        .poster-page * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .poster-page {
          background: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-family: 'Courier New', monospace;
          padding: 24px;
        }

        .poster {
          background: #0a0a0a;
          border: 1px solid #1f1f1f;
          border-radius: 16px;
          padding: 3rem 2.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          max-width: 580px;
          width: 100%;
        }

        .poster::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255, 255, 255, 0.03) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255, 255, 255, 0.03) 40px);
          pointer-events: none;
        }

        .content {
          position: relative;
          z-index: 1;
        }

        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.3em;
          color: #555;
          text-transform: uppercase;
          margin-bottom: 1.2rem;
        }

        .headline-red {
          font-size: clamp(2rem, 6vw, 3.2rem);
          font-weight: 900;
          color: #ef4444;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          line-height: 1.1;
          text-shadow: 0 0 40px rgba(239, 68, 68, 0.6);
        }

        .headline-white {
          font-size: clamp(2rem, 6vw, 3.2rem);
          font-weight: 900;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          line-height: 1.1;
          margin-bottom: 2rem;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
        }

        .divider {
          width: 60px;
          height: 2px;
          background: #ef4444;
          margin: 0 auto 2rem;
        }

        .wallet-label {
          font-size: 11px;
          color: #666;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
        }

        .wallet-box {
          background: #111;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          margin: 0 auto;
          max-width: 500px;
          word-break: break-all;
        }

        .wallet-network {
          font-size: 10px;
          color: #ef4444;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }

        .wallet-address {
          font-size: 13px;
          color: #e2e8f0;
          letter-spacing: 0.05em;
          line-height: 1.6;
        }

        .steps {
          margin-top: 2.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .step {
          text-align: center;
        }

        .step-number {
          font-size: 22px;
          font-weight: 700;
          color: #ef4444;
        }

        .step-label {
          font-size: 10px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
        }

        .arrow {
          color: #2a2a2a;
          font-size: 18px;
        }

        .footer {
          margin-top: 2.5rem;
          font-size: 10px;
          color: #333;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
      `}</style>
    </>
  );
}