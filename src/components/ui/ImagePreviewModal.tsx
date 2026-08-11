/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

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
  companyName = 'Bukti Lamaran',
  jobTitle = 'Screenshot',
}: ImagePreviewModalProps) {
  if (!imageUrl) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Screenshot: ${companyName}`}
      subtitle={jobTitle}
      size="2xl"
    >
      <div className="space-y-4">
        {/* Preview Container */}
        <div className="relative overflow-hidden rounded-xl bg-black/40 border border-[var(--glass-border)] max-h-[70vh] flex items-center justify-center p-2 group">
          <img
            src={imageUrl}
            alt={`Screenshot ${companyName}`}
            className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--glass-border)]">
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-primary)] hover:underline font-medium"
          >
            <ExternalLink size={14} />
            Buka Ukuran Asli di Tab Baru
          </a>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ImagePreviewModal;
