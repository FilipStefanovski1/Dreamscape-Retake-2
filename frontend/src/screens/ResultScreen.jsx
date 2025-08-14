import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ResultScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const imageURL = location.state?.imageURL || "";
  const results = Array.isArray(location.state?.results) ? location.state.results : [];

  return (
    <section className="dp4-page">
      <h2>Results</h2>

      {!imageURL && results.length === 0 ? (
        <>
          <p>No scan found.</p>
          <button className="dp4-button" onClick={() => navigate("/scan")}>Go to Scan</button>
        </>
      ) : (
        <>
          {imageURL ? (
            <div className="dp4-preview small">
              <img src={imageURL} alt="scanned" />
            </div>
          ) : null}

          <div className="dp4-results">
            <h3>Most likely objects</h3>
            {results.length ? (
              <ol>
                {results.map((r, i) => (
                  <li key={i}>
                    <span>{r.label}</span>
                    <span>{Math.round((r.score ?? 0) * 100)}%</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p>No results.</p>
            )}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link to="/scan" className="dp4-button">Scan another</Link>
            <Link to="/" className="dp4-button">Back to Home</Link>
          </div>
        </>
      )}
    </section>
  );
}
