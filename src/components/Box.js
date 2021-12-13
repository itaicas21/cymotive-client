import React from "react";

export default function Box({ title, result }) {
  return (
    <div className="box">
      <div className="title">{title}</div>
      <div className="result">{result}</div>
    </div>
  );
}
