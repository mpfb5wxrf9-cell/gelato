import { useCallback } from "react";
import { useOrder } from "./hooks/useOrder";
import { useIdleTimeout } from "./hooks/useIdleTimeout";
import IdleScreen from "./screens/IdleScreen";
import OrderTypeScreen from "./screens/OrderTypeScreen";
import MenuScreen from "./screens/MenuScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import ConfirmationScreen from "./screens/ConfirmationScreen";

const IDLE_TIMEOUT_MS = 45000;

export default function App() {
  const order = useOrder();
  const { stage, resetOrder, startOrder, chooseOrderType } = order;

  const onRestart = useCallback(() => resetOrder(), [resetOrder]);

  useIdleTimeout(stage === "orderType" || stage === "menu" || stage === "checkout", IDLE_TIMEOUT_MS, resetOrder);

  return (
    <div className="kiosk-shell">
      {stage === "idle" && (
        <div className="screen" key="idle">
          <IdleScreen onStart={startOrder} />
        </div>
      )}
      {stage === "orderType" && (
        <div className="screen" key="orderType">
          <OrderTypeScreen onChoose={chooseOrderType} onRestart={onRestart} />
        </div>
      )}
      {stage === "menu" && (
        <div className="screen" key="menu">
          <MenuScreen order={order} onRestart={onRestart} />
        </div>
      )}
      {stage === "checkout" && (
        <div className="screen" key="checkout">
          <CheckoutScreen order={order} onRestart={onRestart} />
        </div>
      )}
      {stage === "confirmation" && (
        <div className="screen" key="confirmation">
          <ConfirmationScreen order={order} />
        </div>
      )}
    </div>
  );
}
