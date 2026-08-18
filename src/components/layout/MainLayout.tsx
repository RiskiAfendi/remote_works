'use client';

import { useState, useCallback, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import { PinModal } from '@/features/auth/PinModal';
import { ShortcutsModal } from '@/components/ui/ShortcutsModal';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  onOpenNewApplicationModal?: () => void;
}

/**
 * Layout utama aplikasi.
 * Menggabungkan Navbar, Sidebar, ToastProvider, PinModal, ShortcutsModal, dan area konten utama.
 */
export default function MainLayout({ children, onOpenNewApplicationModal }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const { isLocked, unlock, lock } = useAuth();

  // Register Global Keyboard Shortcuts across all pages
  useKeyboardShortcuts({
    disabled: isLocked,
    onToggleLock: () => {
      lock();
    },
    onToggleHelp: () => {
      setIsShortcutsOpen((prev) => !prev);
    },
    onEscape: () => {
      if (isShortcutsOpen) setIsShortcutsOpen(false);
      if (sidebarOpen) setSidebarOpen(false);
    },
  });

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleOpenShortcuts = useCallback(() => {
    setIsShortcutsOpen(true);
  }, []);

  const handleCloseShortcuts = useCallback(() => {
    setIsShortcutsOpen(false);
  }, []);

  // Lock body scroll on mobile when sidebar is open
  useEffect(() => {
    const isMobile = () => window.innerWidth < 1024; // lg breakpoint
    if (sidebarOpen && isMobile()) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('sidebar-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('sidebar-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);

  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
        {/* Ambient Liquid Glass Mesh Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-300/30 dark:bg-sky-500/10 blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-blue-300/25 dark:bg-blue-600/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] rounded-full bg-cyan-300/20 dark:bg-cyan-500/10 blur-3xl" />
        </div>

        {/* Navbar */}
        <Navbar
          onToggleSidebar={handleToggleSidebar}
          onOpenNewApplicationModal={onOpenNewApplicationModal}
          onLockDashboard={lock}
          onOpenShortcuts={handleOpenShortcuts}
        />

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={handleCloseSidebar}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Area konten utama */}
        <main
          className={cn(
            'pt-16 min-h-screen transition-all duration-300',
            sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]',
            // When mobile sidebar is open, block all interaction with main content
            sidebarOpen ? 'pointer-events-none select-none lg:pointer-events-auto lg:select-auto' : ''
          )}
          aria-hidden={sidebarOpen ? true : undefined}
        >
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in space-y-8">
            {children}
          </div>
        </main>

        {/* Keyboard Shortcuts Guide Modal */}
        <ShortcutsModal isOpen={isShortcutsOpen} onClose={handleCloseShortcuts} />

        {/* Fullscreen PIN Lock Modal */}
        <PinModal isOpen={isLocked} onUnlock={unlock} />
      </div>
    </ToastProvider>
  );
}
