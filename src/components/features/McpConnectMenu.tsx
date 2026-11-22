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
    url: 'https://help.openai.com/en/articles/11487775-connectors-in-chatgpt',
  },
  {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai/settings/connectors',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    url: 'https://cursor.com/docs/context/mcp',
  },
  {
    id: 'vscode',
    name: 'VS Code Copilot',
    url: 'https://code.visualstudio.com/docs/copilot/customization/mcp-servers',
  },
];

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
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-[var(--text-primary)] hover:bg-[var(--glass-surface-strong)] transition-colors"
              >
                <span className="font-semibold">{provider.name}</span>
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
