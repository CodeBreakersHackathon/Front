import React, { useState, useEffect, useRef } from "react";
import { CulqiButton } from "../component/CulqiButton";
import "../culqi.css";
import { CustomerInfo, ItemInfo } from "../config/Customer";

const customerInfo : CustomerInfo = {
   firstName: "Salvador",
   lastName: "Donayre Epifanía",
   address: "Av. Brasil",
   addressCity: "Pueblo Libre, Lima, Lima",
   phone: "948331665",
   email: "review@culqi.com"
 };

 const itemInfo : ItemInfo = {
    description: "Cursos de React",
    order: "handin-" + (new Date()).getTime()
  };

const OnlyCharge = () => {
  const [chargeMessage, setChargeMessage] = useState<string>("");

  return (
    <div id="only-charge" data-mode-content="only-charge">
      <h1>Crear Cargo</h1>
      <p>(Cargo + 3DS)</p>

      <div className="button-container">

        <CulqiButton 
          buttonTitle="Pagar con Culqi"
          

          chargeMessage={chargeMessage} 
          customerInfo={customerInfo}
          itemInfo={itemInfo}
          total_amount={50000}
          expiration_date={new Date(Date.now() + 3600)}
          setChargeMessage={setChargeMessage} />

        <div className="response-container">
          <span>Respuesta: {chargeMessage} </span>
          <p id="cardResponse"></p>
        </div>
      </div>
    </div>
  );
};

export default OnlyCharge;
