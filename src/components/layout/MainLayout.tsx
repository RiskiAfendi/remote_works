'use client';

import { useState, useCallback, useRef } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import { PinModal } from '@/features/auth/PinModal';
import { ShortcutsModal } from '@/components/ui/ShortcutsModal';
import { useAuth } from '@/hooks/useAuth';
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

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
        {/* Fullscreen PIN Lock Modal */}
        <PinModal isOpen={isLocked} onUnlock={unlock} />

        {/* Keyboard Shortcuts Guide Modal */}
        <ShortcutsModal isOpen={isShortcutsOpen} onClose={handleCloseShortcuts} />

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
            sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
          )}
        >
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in space-y-8">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
