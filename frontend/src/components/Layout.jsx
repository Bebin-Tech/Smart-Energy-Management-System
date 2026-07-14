import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Activity,
  Bot,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
  Zap,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/buildings', label: 'Buildings', icon: Building2 },
  { to: '/departments', label: 'Departments', icon: Users },
  { to: '/energy', label: 'Energy Usage', icon: Zap },
  { to: '/ai', label: 'AI Insights', icon: Bot },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Layout = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div
        className={clsx(
          'fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white/95 shadow-xl shadow-slate-200/80 backdrop-blur transition-all duration-300 ease-out',
          isCollapsed ? 'lg:w-20' : 'lg:w-72',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'w-72'
        )}
      >
        <div className="flex h-20 items-center gap-3 px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Activity className="h-6 w-6" />
          </div>
          <div className={clsx('min-w-0 transition-all duration-200', isCollapsed && 'lg:pointer-events-none lg:w-0 lg:opacity-0')}>
            <h1 className="truncate text-xl font-bold text-slate-950">SmartEnergy</h1>
            <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">Management Suite</p>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="ml-auto rounded p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'group relative flex h-12 items-center gap-3 rounded px-3 text-sm font-semibold transition-all duration-200',
                  'hover:translate-x-1 hover:bg-blue-50 hover:text-blue-700',
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-600 hover:text-white' : 'text-slate-600'
                )
              }
              title={isCollapsed ? label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className={clsx('truncate transition-all duration-200', isCollapsed && 'lg:w-0 lg:opacity-0')}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={() => setIsCollapsed((value) => !value)}
            className="hidden h-10 w-full items-center justify-center rounded border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 lg:flex"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          <button
            onClick={handleLogout}
            className="flex h-11 w-full items-center gap-3 rounded px-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={clsx('transition-all duration-200', isCollapsed && 'lg:w-0 lg:opacity-0')}>Logout</span>
          </button>
        </div>
      </aside>

      <div className={clsx('min-h-screen transition-all duration-300', isCollapsed ? 'lg:pl-20' : 'lg:pl-72')}>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="rounded p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-sm font-bold text-slate-900">SmartEnergy</span>
          <div className="h-10 w-10" />
        </header>

        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
