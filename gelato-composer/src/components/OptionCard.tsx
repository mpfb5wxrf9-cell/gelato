interface OptionCardProps {
  label: string;
  sub?: string;
  price?: number;
  swatch: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function OptionCard({
  label,
  sub,
  price,
  swatch,
  selected,
  onClick,
  disabled,
}: OptionCardProps) {
  return (
    <button
      type="button"
      className={`option-card${selected ? " selected" : ""}${disabled ? " disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="option-swatch" style={{ background: swatch }}>
        {selected && (
          <svg viewBox="0 0 20 20" className="option-check" aria-hidden="true">
            <path
              d="M4 10.5l3.8 3.8L16 6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="option-label">{label}</span>
      {sub && <span className="option-sub">{sub}</span>}
      {typeof price === "number" && price > 0 && (
        <span className="option-price">+{price.toFixed(2).replace(".", ",")}&nbsp;€</span>
      )}
    </button>
  );
}
