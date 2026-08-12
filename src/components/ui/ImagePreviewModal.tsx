/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n } from '@/context/I18nContext';

export interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  companyName?: string;
  jobTitle?: string;
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  companyName,
  jobTitle,
}: ImagePreviewModalProps) {
  const { t } = useI18n();

  if (!imageUrl) return null;

  const displayCompany = companyName || t('imagePreview.defaultCompany');
  const displayJobTitle = jobTitle || t('imagePreview.defaultTitle');

  const handleOpenInNewTab = (e: React.MouseEvent) => {
    e.preventDefault();
    if (imageUrl.startsWith('data:')) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>Screenshot - ${displayCompany}</title>
              <style>
                body {
                  margin: 0;
                  background-color: #0b0f17;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  font-family: system-ui, -apple-system, sans-serif;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  max-height: 100vh;
                  object-fit: contain;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
              </style>
            </head>
            <body>
              <img src="${imageUrl}" alt="Screenshot ${displayCompany}" />
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } else {
      window.open(imageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('imagePreview.title', { company: displayCompany })}
      subtitle={displayJobTitle}
      size="2xl"
    >
      <div className="space-y-4">
        {/* Preview Container */}
        <div className="relative overflow-hidden rounded-xl bg-black/40 border border-[var(--glass-border)] max-h-[70vh] flex items-center justify-center p-2 group">
          <img
            src={imageUrl}
            alt={`Screenshot ${displayCompany}`}
            className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--glass-border)]">
          <button
            type="button"
            onClick={handleOpenInNewTab}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-primary)] hover:underline font-medium cursor-pointer"
          >
            <ExternalLink size={14} />
            {t('imagePreview.openOriginal')}
          </button>

          <Button variant="ghost" size="sm" onClick={onClose}>
            {t('imagePreview.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ImagePreviewModal;
