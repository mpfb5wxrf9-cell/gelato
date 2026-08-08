import { useEffect } from "react";
import { CheckIcon } from "../components/Icons";
import type { OrderApi } from "../hooks/useOrder";

interface ConfirmationScreenProps {
  order: OrderApi;
}

const AUTO_RESET_MS = 12000;

export default function ConfirmationScreen({ order }: ConfirmationScreenProps) {
  const { orderNumber, orderType, resetOrder } = order;

  useEffect(() => {
    const t = setTimeout(resetOrder, AUTO_RESET_MS);
    return () => clearTimeout(t);
  }, [resetOrder]);

  return (
    <div className="confirm-screen">
      <div className="confirm-check">
        <CheckIcon />
      </div>
      <span className="confirm-number-label">Il tuo numero</span>
      <p className="confirm-number">{orderNumber}</p>
      <p className="confirm-message">
        {orderType === "qui"
          ? "Il tuo ordine è in preparazione: te lo porteremo direttamente al tavolo."
          : "Il tuo ordine è in preparazione: ritiralo al banco quando senti chiamare il tuo numero."}
      </p>
      <button className="confirm-new" type="button" onClick={resetOrder}>
        Nuovo ordine
      </button>
    </div>
  );
}
