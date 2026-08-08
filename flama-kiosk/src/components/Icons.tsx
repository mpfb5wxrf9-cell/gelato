type IconProps = { className?: string };

export function TrayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <rect x="6" y="20" width="36" height="6" rx="2" fill="#E1462C" />
      <path d="M8 26h32l-3 12a4 4 0 0 1-4 3H15a4 4 0 0 1-4-3z" fill="#F2C77A" stroke="#B4813A" strokeWidth="1.4" />
      <circle cx="24" cy="14" r="8" fill="#F7DA8C" stroke="#B4813A" strokeWidth="1.4" />
    </svg>
  );
}

export function BagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <path d="M12 16h24l2 26a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3z" fill="#F2C77A" stroke="#B4813A" strokeWidth="1.4" />
      <path d="M17 16v-3a7 7 0 0 1 14 0v3" stroke="#B4813A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="10" y="15" width="28" height="6" rx="2" fill="#E1462C" />
    </svg>
  );
}

export function CartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="21" r="1.6" fill="currentColor" />
      <circle cx="17.5" cy="21" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function MinusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M4 13l5 5L20 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RestartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M4 12a8 8 0 1 1 2.6 5.9M4 12V6M4 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <rect x="6" y="12" width="36" height="24" rx="4" fill="#F7F3E8" stroke="#B4813A" strokeWidth="1.6" />
      <rect x="6" y="18" width="36" height="6" fill="#241F1C" />
      <rect x="11" y="29" width="12" height="4" rx="1.5" fill="#E1462C" />
    </svg>
  );
}

export function ContactlessIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <rect x="8" y="10" width="26" height="28" rx="4" fill="#F7F3E8" stroke="#B4813A" strokeWidth="1.6" />
      <path d="M30 16a10 10 0 0 1 0 16M34 12a16 16 0 0 1 0 24M38 8a22 22 0 0 1 0 32" stroke="#E1462C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function EmptyCartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path d="M10 12h6l7 32a5 5 0 0 0 5 4h20a5 5 0 0 0 5-4l4-22H20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx="26" cy="54" r="3.4" fill="currentColor" opacity="0.5" />
      <circle cx="44" cy="54" r="3.4" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function CatMenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <path d="M16 4l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function CatBurgerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <path d="M6 14c0-5 4.5-8 10-8s10 3 10 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="6" y1="21" x2="26" y2="21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 25c0 1.6 1.4 3 6 3h8c4.6 0 6-1.4 6-3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function CatChickenIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <path
        d="M14 6c3-2 8-1 9 4 1 4-1 6-1 9 0 4-3 8-8 8s-7-4-6-8c1-4 4-4 5-7 1-3 0-5 1-6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function CatFriesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <path d="M9 15v-8M13 15v-10M16 15v-9M19 15v-11M23 15v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 15h17l-2 12H10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function CatDrinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <path d="M9 9h14l-2 18a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <line x1="8" y1="9" x2="24" y2="9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="18" y1="4" x2="14" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CatDessertIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <path d="M11 14a5 5 0 0 1 10 0z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <path d="M9 14h14l-5 14a2 2 0 0 1-2 1.6 2 2 0 0 1-2-1.6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <path d="M24 6l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="#F2A93B" />
    </svg>
  );
}
