'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  PlugZap,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const MCP_CONFIG = JSON.stringify(
  {
    mcpServers: {
      'remote-works': {
        command: 'node',
        args: ['/absolute/path/to/remote_works/scripts/mcp-server.mjs'],
        cwd: '/absolute/path/to/remote_works',
      },
    },
  },
  null,
  2
);

const providers = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chatgpt.com/plugins',
    action: 'Open Plugins',
  },
  {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai/settings/connectors',
    action: 'Open Connectors',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    url: 'cursor://anysphere.cursor-deeplink/mcp/install',
    action: 'Install MCP',
  },
  {
    id: 'vscode',
    name: 'VS Code Copilot',
    url: 'vscode:mcp/install',
    action: 'Install MCP',
  },
];

function buildCursorInstallUrl() {
  const config = window.btoa(
    JSON.stringify({
      command: 'node',
      args: ['/absolute/path/to/remote_works/scripts/mcp-server.mjs'],
    })
  );
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=remote-works&config=${config}`;
}

function buildVscodeInstallUrl() {
  const config = encodeURIComponent(
    JSON.stringify({
      name: 'remote-works',
      command: 'node',
      args: ['/absolute/path/to/remote_works/scripts/mcp-server.mjs'],
    })
  );
  return `vscode:mcp/install?${config}`;
}

export function McpConnectMenu({ className }: { className?: string }) {
  const { t } = useI18n();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const copyConfig = async () => {
    try {
      await navigator.clipboard.writeText(MCP_CONFIG);
      toast.success(t('mcp.configCopied'));
    } catch {
      toast.error(t('mcp.copyFailed'));
    }
  };

  const downloadConfig = () => {
    const blob = new Blob([MCP_CONFIG], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'remote-works-mcp.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          'h-9 flex items-center gap-2 px-3 rounded-xl text-xs font-semibold',
          'hover:bg-[var(--glass-surface-strong)] active-press focus-ring transition-all',
          'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
          'border border-[var(--glass-border)] bg-[var(--glass-surface)]'
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <PlugZap size={16} className="text-[var(--accent-primary)]" />
        <span className="hidden md:inline">{t('mcp.connect')}</span>
        <ChevronDown
          size={14}
          className={cn('transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] w-72 rounded-2xl border border-[var(--glass-border-strong)] bg-[var(--bg-elevated)] shadow-2xl p-2 z-[70]"
        >
          <div className="px-3 py-2">
            <p className="text-xs font-bold text-[var(--text-primary)]">
              {t('mcp.menuTitle')}
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">
              {t('mcp.menuSubtitle')}
            </p>
          </div>

          <div className="space-y-1">
            {providers.map((provider) => (
              <a
                key={provider.id}
                role="menuitem"
                href={provider.url}
                target={provider.id === 'chatgpt' || provider.id === 'claude' ? '_blank' : undefined}
                rel={provider.id === 'chatgpt' || provider.id === 'claude' ? 'noreferrer' : undefined}
                onClick={(event) => {
                  if (provider.id === 'cursor') {
                    event.preventDefault();
                    window.location.href = buildCursorInstallUrl();
                  } else if (provider.id === 'vscode') {
                    event.preventDefault();
                    window.location.href = buildVscodeInstallUrl();
                  }
                  setIsOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-[var(--text-primary)] hover:bg-[var(--glass-surface-strong)] transition-colors"
              >
                <div>
                  <span className="font-semibold block">{provider.name}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {provider.action}
                  </span>
                </div>
                <ExternalLink size={14} className="text-[var(--text-muted)]" />
              </a>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--glass-border)] grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={copyConfig}
              className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-surface-strong)] transition-colors"
            >
              <Copy size={14} />
              {t('mcp.copyConfig')}
            </button>
            <button
              type="button"
              onClick={downloadConfig}
              className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-surface-strong)] transition-colors"
            >
              <Download size={14} />
              {t('mcp.downloadConfig')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
