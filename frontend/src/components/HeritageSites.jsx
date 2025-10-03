import React from "react";
import heritageSites from "../assets/heritageSites.json";

export default function HeritageSites() {
  return (
    <div>
      {heritageSites.map((site) => (
        <div key={site._id}>{site.name}</div>
      ))}
    </div>
  );
}
