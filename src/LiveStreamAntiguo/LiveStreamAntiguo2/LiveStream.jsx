import React, { useState } from "react";
import LiveStreamEmitter from "./LiveStreamEmitter.jsx";
import LiveStreamViewer from "./LiveStreamViewer.jsx";

const LiveStream = () => {
  const [mode, setMode] = useState(null); // null, 'emitter', or 'viewer'

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
  };

  const renderContent = () => {
    if (mode === "emitter") {
      return <LiveStreamEmitter />;
    } else if (mode === "viewer") {
      return <LiveStreamViewer />;
    }
    return (
      <div>
        <h2>Elige un modo</h2>
        <button
          onClick={() => handleSelectMode("emitter")}
          style={{ margin: "10px", padding: "10px 20px" }}
        >
          Transmitir
        </button>
        <button
          onClick={() => handleSelectMode("viewer")}
          style={{ margin: "10px", padding: "10px 20px" }}
        >
          Ver
        </button>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

export default LiveStream;
