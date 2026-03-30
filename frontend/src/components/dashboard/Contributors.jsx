// 🔥 UPDATED: Contributors.jsx (Persona Badge)

import React from "react";

const Contributors = ({ contributors, ai }) => {
  if (!contributors) return null;

  // 🔥 MAP PERSONAS BY NAME
  const personaMap = {};
  ai?.personas?.forEach((p) => {
    personaMap[p.name] = p.persona;
  });

  return (
    <div className="card glass">
      <h2>👥 Contributors</h2>

      {contributors.map((c, index) => (
        <div key={index} className="contributor-card">

          {/* 🔥 NAME + PERSONA BADGE */}
          <h4>
            {c.name}
            <span className="badge">
              {personaMap[c.name] || "Contributor"}
            </span>
          </h4>

          <p>Commits: {c.commits}</p>
        </div>
      ))}
    </div>
  );
};

export default Contributors;