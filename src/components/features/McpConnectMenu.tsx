'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Copy,
  ExternalLink,
  PlugZap,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

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
    id: 'codex',
    name: 'Codex',
    url: 'https://chatgpt.com/codex',
    action: 'Open Codex',
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

type ProviderId = 'chatgpt' | 'claude' | 'codex' | 'cursor' | 'vscode';

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
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>('chatgpt');
  const containerRef = useRef<HTMLDivElement>(null);
  const mcpServerUrl =
    process.env.NEXT_PUBLIC_MCP_SERVER_URL?.trim() || 'https://example.com/mcp';
  const mcpName = 'remote-works';
  const mcpDescription =
    'Manage job applications, job sources, and job directories in Remote Works.';
  const mcpCommand = 'node';
  const mcpArguments = '/absolute/path/to/remote_works/scripts/mcp-server.mjs';
  const mcpWorkingDirectory = '/absolute/path/to/remote_works';

  const copyValue = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t('mcp.fieldCopied', { field: label }));
    } catch {
      toast.error(t('mcp.copyFailed'));
    }
  };

  const openSetup = (providerId: ProviderId) => {
    setSelectedProvider(providerId);
    setIsSetupOpen(true);
    setIsOpen(false);
  };

  const setupFields: Record<
    ProviderId,
    Array<{ label: string; value: string }>
  > = {
    chatgpt: [
      { label: t('mcp.fieldName'), value: mcpName },
      { label: t('mcp.fieldDescription'), value: mcpDescription },
      { label: t('mcp.fieldType'), value: 'Server URL / Streamable HTTP' },
      { label: t('mcp.fieldServerUrl'), value: mcpServerUrl },
      { label: t('mcp.fieldAuthentication'), value: 'Bearer token' },
    ],
    claude: [
      { label: t('mcp.fieldName'), value: mcpName },
      { label: t('mcp.fieldDescription'), value: mcpDescription },
      { label: t('mcp.fieldType'), value: 'Remote / Streamable HTTP' },
      { label: t('mcp.fieldServerUrl'), value: mcpServerUrl },
      { label: t('mcp.fieldAuthentication'), value: 'Bearer token or OAuth' },
    ],
    codex: [
      { label: t('mcp.fieldName'), value: mcpName },
      { label: t('mcp.fieldType'), value: 'STDIO' },
      { label: t('mcp.fieldCommand'), value: mcpCommand },
      { label: t('mcp.fieldArguments'), value: mcpArguments },
      { label: t('mcp.fieldWorkingDirectory'), value: mcpWorkingDirectory },
      { label: t('mcp.fieldEnvironmentVariable'), value: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>' },
    ],
    cursor: [
      { label: t('mcp.fieldName'), value: mcpName },
      { label: t('mcp.fieldType'), value: 'STDIO' },
      { label: t('mcp.fieldCommand'), value: mcpCommand },
      { label: t('mcp.fieldArguments'), value: mcpArguments },
      { label: t('mcp.fieldWorkingDirectory'), value: mcpWorkingDirectory },
    ],
    vscode: [
      { label: t('mcp.fieldName'), value: mcpName },
      { label: t('mcp.fieldType'), value: 'STDIO' },
      { label: t('mcp.fieldCommand'), value: mcpCommand },
      { label: t('mcp.fieldArguments'), value: mcpArguments },
      { label: t('mcp.fieldWorkingDirectory'), value: mcpWorkingDirectory },
    ],
  };

  const localConfig = JSON.stringify(
    {
      mcpServers: {
        'remote-works': {
          command: mcpCommand,
          args: [mcpArguments],
          cwd: mcpWorkingDirectory,
        },
      },
    },
    null,
    2
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <>
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

          <div className="mt-2 pt-2 border-t border-[var(--glass-border)]">
            <button
              type="button"
              onClick={() => openSetup(selectedProvider)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-surface-strong)] transition-colors"
            >
              <Copy size={14} />
              {t('mcp.openSetupGuide')}
            </button>
          </div>
        </div>
      )}
    </div>

    <Modal
      isOpen={isSetupOpen}
      onClose={() => setIsSetupOpen(false)}
      title={t('mcp.setupTitle')}
      subtitle={t('mcp.setupSubtitle')}
      size="xl"
    >
      <div className="space-y-5">
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
          {providers.map((provider) => (
            <button
              key={provider.id}
              type="button"
              role="tab"
              aria-selected={selectedProvider === provider.id}
              onClick={() => setSelectedProvider(provider.id as ProviderId)}
              className={cn(
                'shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors',
                selectedProvider === provider.id
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                  : 'border-[var(--glass-border)] text-[var(--text-secondary)] hover:bg-[var(--glass-surface-strong)]'
              )}
            >
              {provider.name}
            </button>
          ))}
        </div>

        {(['chatgpt', 'claude'].includes(selectedProvider)) && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
            {t('mcp.publicEndpointNotice')}
          </div>
        )}

        <div className="space-y-2">
          {setupFields[selectedProvider].map((field) => (
            <div
              key={field.label}
              className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-surface)] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase">
                    {field.label}
                  </span>
                  <code className="block mt-1 text-xs text-[var(--text-primary)] break-all">
                    {field.value}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => copyValue(field.value, field.label)}
                  className="shrink-0 p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-surface-strong)] transition-colors"
                  aria-label={`${t('mcp.copyField')} ${field.label}`}
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {(['codex', 'cursor', 'vscode'].includes(selectedProvider)) && (
          <div className="rounded-xl border border-[var(--glass-border)] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                {t('mcp.completeConfig')}
              </span>
              <button
                type="button"
                onClick={() => copyValue(localConfig, t('mcp.completeConfig'))}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <Copy size={14} />
                {t('mcp.copyAll')}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-black/30 p-3 text-[11px] text-[var(--text-primary)]">
              {localConfig}
            </pre>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            const provider = providers.find((item) => item.id === selectedProvider);
            if (!provider) return;
            if (selectedProvider === 'cursor') {
              window.location.href = buildCursorInstallUrl();
            } else if (selectedProvider === 'vscode') {
              window.location.href = buildVscodeInstallUrl();
            } else {
              window.open(provider.url, '_blank', 'noopener,noreferrer');
            }
          }}
          className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold border border-[var(--glass-border-strong)] text-[var(--text-primary)] hover:bg-[var(--glass-surface-strong)]"
        >
          <ExternalLink size={16} />
          {providers.find((item) => item.id === selectedProvider)?.action}
        </button>
      </div>
    </Modal>
    </>
  );
}
