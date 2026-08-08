import { TrayIcon, BagIcon, RestartIcon } from "../components/Icons";
import type { OrderType } from "../hooks/useOrder";

interface OrderTypeScreenProps {
  onChoose: (type: OrderType) => void;
  onRestart: () => void;
}

export default function OrderTypeScreen({ onChoose, onRestart }: OrderTypeScreenProps) {
  return (
    <div className="ordertype-screen">
      <div className="step-topbar">
        <span className="step-brand">FLAMA</span>
        <button className="step-restart" type="button" onClick={onRestart}>
          <RestartIcon />
          Ricomincia
        </button>
      </div>
      <div className="ordertype-main">
        <h1 className="ordertype-title">Dove mangi oggi?</h1>
        <div className="ordertype-cards">
          <button className="ordertype-card" type="button" onClick={() => onChoose("qui")}>
            <TrayIcon className="ordertype-icon" />
            <strong>Mangio qui</strong>
            <span>Ti portiamo l'ordine al tavolo con il vassoio</span>
          </button>
          <button className="ordertype-card" type="button" onClick={() => onChoose("asporto")}>
            <BagIcon className="ordertype-icon" />
            <strong>Porto via</strong>
            <span>Ordine pronto da ritirare al banco, in busta</span>
          </button>
        </div>
      </div>
    </div>
  );
}
