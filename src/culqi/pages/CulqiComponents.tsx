import React, { useState, useEffect, useRef } from "react";
import { CulqiButton } from "../component/CulqiButton";
import "../culqi.css";

const OnlyCharge = () => {
  const [chargeMessage, setChargeMessage] = useState<string>("");

  return (
    <div id="only-charge" data-mode-content="only-charge">
      <h1>Crear Cargo</h1>
      <p>(Cargo + 3DS)</p>

      <div className="button-container">
        <CulqiButton chargeMessage={chargeMessage} setChargeMessage={setChargeMessage} />
        <div className="response-container">
          <span>Respuesta: {chargeMessage} </span>
          <p id="cardResponse"></p>
        </div>
      </div>
    </div>
  );
};

export default OnlyCharge;
