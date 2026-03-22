import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, ClipboardCheck, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tasks', label: 'Manage Tasks', icon: ClipboardCheck },
  { path: '/my-tasks', label: 'My Tasks', icon: ListTodo },
  { path: '/team', label: 'Team', icon: Users },
];

export default function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border fixed inset-y-0 z-30">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
          <p className="text-xs text-muted-foreground mt-1">Team Task Manager</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}>
                <item.icon className="w-5 h-5" />{item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h1 className="text-xl font-bold">TaskFlow</h1>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></Button>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}>
                    <item.icon className="w-5 h-5" />{item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <main className="flex-1 lg:ml-64">
        <header className="lg:hidden sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></Button>
          <h1 className="text-lg font-bold">TaskFlow</h1>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto"><Outlet /></div>
      </main>
    </div>
  );
}