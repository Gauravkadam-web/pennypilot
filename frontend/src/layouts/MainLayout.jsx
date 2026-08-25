// frontend/src/layouts/MainLayout.jsx
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Moon, Sun, Menu, X, Tag } from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';

const NAV_ITEMS = [
  { to: '/',           label: 'Dashboard',  icon: LayoutDashboard, id: 'nav-dashboard', end: true },
  { to: '/expenses',   label: 'Expenses',   icon: Receipt,          id: 'nav-expenses' },
  { to: '/categories', label: 'Categories', icon: Tag,              id: 'nav-categories' },
];

/**
 * Wrapper around NavLink that correctly applies aria-current.
 * NavLink's render-prop gives us `isActive`; plain JSX attributes
 * cannot receive a function, so we use a wrapper component instead.
 */
function NavItem({ to, label, icon: Icon, id, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      id={id}
      onClick={onClick}
      className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
    >
      {({ isActive }) => (
        <>
          <Icon size={18} aria-hidden="true" />
          <span aria-current={isActive ? 'page' : undefined}>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function MainLayout() {
  const { theme, toggleTheme } = useAppContext();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  // Handle ESC key to close mobile nav
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileNavOpen) {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileNavOpen]);

  const pageTitle = NAV_ITEMS.find(n =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  )?.label || 'PennyPilot';

  return (
    <div className="app-shell">
      {/* Desktop Sidebar */}
      <aside className="sidebar" aria-label="Main navigation">
        <div className="sidebar__logo">
          <div className="sidebar__logo-mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div>
            <div className="sidebar__logo-text">PennyPilot</div>
            <div className="sidebar__logo-sub">Expense Tracker</div>
          </div>
        </div>

        <nav className="sidebar__nav" aria-label="App navigation">
          <div className="sidebar__nav-label">Menu</div>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="sidebar__footer">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            id="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileNavOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`mobile-drawer ${mobileNavOpen ? 'mobile-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="mobile-drawer__header">
          <div className="sidebar__logo" style={{ padding: 0, border: 'none' }}>
            <div className="sidebar__logo-mark" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div>
              <div className="sidebar__logo-text">PennyPilot</div>
              <div className="sidebar__logo-sub">Expense Tracker</div>
            </div>
          </div>
          <button
            className="action-btn"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation menu"
            id="close-mobile-menu-btn"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mobile-drawer__nav" aria-label="Mobile menu links">
          <div className="sidebar__nav-label" style={{ paddingLeft: 'var(--space-2)' }}>Menu</div>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              id={`mobile-${item.id}`}
              onClick={() => setMobileNavOpen(false)}
            />
          ))}
        </nav>

        <div className="mobile-drawer__footer">
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Theme Mode</span>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            id="mobile-theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="navbar" role="banner">
          <div className="navbar__left">
            <button
              className="hamburger-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              id="open-mobile-menu-btn"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            {/* Not an h1 — page already has its own h1. This is just a visual label. */}
            <p className="navbar__title">{pageTitle}</p>
          </div>
          
          <div className="navbar__actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              id="navbar-theme-toggle-btn"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        <main className="page-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
