import { NavLink } from 'react-router-dom';
import { ChatBubbleIcon, GearIcon } from './Icons';

export function TabBar() {
  return (
    <nav
      className="glass"
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 12px calc(10px + var(--safe-bottom))',
        borderRadius: 0,
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        zIndex: 20,
      }}
    >
      <TabLink to="/chats" label="Messaggi" icon={<ChatBubbleIcon />} />
      <TabLink to="/settings" label="Impostazioni" icon={<GearIcon />} />
    </nav>
  );
}

function TabLink({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className="press"
      style={({ isActive }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '4px 22px',
        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
        fontSize: 11,
        fontWeight: 600,
      })}
    >
      {icon}
      {label}
    </NavLink>
  );
}
