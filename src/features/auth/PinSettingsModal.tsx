'use client';

import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  MessageSquare,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/utils';

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export interface PinSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VerificationMethod = 'github' | 'email' | 'whatsapp' | 'current_pin' | null;
type Step = 'choose_method' | 'verify' | 'new_pin' | 'success';

export function PinSettingsModal({ isOpen, onClose }: PinSettingsModalProps) {
  const { currentPinCode, updatePinDirectly, hasCustomPinSet } = useAuth();
  const { t } = useI18n();
  const toast = useToast();

  const [step, setStep] = useState<Step>('choose_method');
  const [method, setMethod] = useState<VerificationMethod>(null);

  // Form states
  const [targetContact, setTargetContact] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [currentPinInput, setCurrentPinInput] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');

  // Status states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);

  const resetModal = () => {
    setStep('choose_method');
    setMethod(null);
    setTargetContact('');
    setOtpInput('');
    setCurrentPinInput('');
    setNewPin('');
    setConfirmPin('');
    setError('');
    setLoading(false);
    setIsOtpSent(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // 1. Pilih Metode Verifikasi
  const handleSelectMethod = (selected: VerificationMethod) => {
    setMethod(selected);
    setError('');
    if (selected === 'github') {
      setStep('verify');
    } else if (selected === 'email') {
      setTargetContact('user@remoteworks.dev');
      setStep('verify');
    } else if (selected === 'whatsapp') {
      setTargetContact('+62 812-3456-7890');
      setStep('verify');
    } else if (selected === 'current_pin') {
      setStep('verify');
    }
  };

  // 2. Simulasi Kirim OTP
  const handleSendOtp = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setIsOtpSent(true);
      toast.info(t('pinSettings.otpSentToast', { contact: targetContact }));
    }, 1000);
  };

  // 3. Eksekusi Verifikasi (GitHub / OTP / Current PIN)
  const handleVerifyStep = () => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (method === 'github') {
        // Simulasi GitHub OAuth sukses
        setStep('new_pin');
        toast.success(t('pinSettings.githubSuccessToast'));
      } else if (method === 'email' || method === 'whatsapp') {
        if (otpInput === '123456' || otpInput.length === 6) {
          setStep('new_pin');
          toast.success(t('pinSettings.otpSuccessToast'));
        } else {
          setError(t('pinSettings.otpError'));
        }
      } else if (method === 'current_pin') {
        if (currentPinInput === currentPinCode) {
          setStep('new_pin');
          toast.success(t('pinSettings.currentPinSuccessToast'));
        } else {
          setError(t('pinSettings.currentPinError'));
        }
      }
    }, 800);
  };

  // 4. Buat / Simpan PIN Baru
  const handleSaveNewPin = () => {
    setError('');
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setError(t('pinSettings.pinLengthError'));
      return;
    }

    if (newPin !== confirmPin) {
      setError(t('pinSettings.pinMismatchError'));
      return;
    }

    const success = updatePinDirectly(newPin);
    if (success) {
      setStep('success');
      toast.success(t('pinSettings.pinUpdateSuccessToast'));
    } else {
      setError(t('pinSettings.pinUpdateFail'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <Shield className="text-[var(--accent-primary)]" size={22} />
          <span>{hasCustomPinSet ? t('pinSettings.modalTitleEdit') : t('pinSettings.modalTitleCreate')}</span>
        </div>
      }
      subtitle={t('pinSettings.modalSubtitle')}
      size="md"
    >
      <div className="space-y-6 py-1">
        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between text-xs font-semibold px-2 py-1.5 rounded-xl bg-[var(--glass-surface)] border border-[var(--glass-border)] text-[var(--text-secondary)]">
          <span className={cn(step === 'choose_method' && 'text-[var(--accent-primary)] font-bold')}>
            {t('pinSettings.step1')}
          </span>
          <span>&rarr;</span>
          <span className={cn(step === 'verify' && 'text-[var(--accent-primary)] font-bold')}>
            {t('pinSettings.step2')}
          </span>
          <span>&rarr;</span>
          <span className={cn((step === 'new_pin' || step === 'success') && 'text-[var(--accent-primary)] font-bold')}>
            {t('pinSettings.step3')}
          </span>
        </div>

        {/* STEP 1: Pilih Metode Verifikasi */}
        {step === 'choose_method' && (
          <div className="space-y-4">
            <p className="text-xs text-[var(--text-secondary)]">
              {t('pinSettings.chooseMethodDesc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleSelectMethod('github')}
                className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] hover:bg-[var(--glass-surface-strong)] transition-all text-left group active-press"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--glass-surface-strong)] text-[var(--text-primary)] flex items-center justify-center shrink-0 border border-[var(--glass-border-strong)]">
                  <GithubIcon size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                    {t('pinSettings.githubAuthTitle')}
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)]">{t('pinSettings.githubAuthDesc')}</p>
                </div>
              </button>

              {/* Email OTP */}
              <button
                type="button"
                onClick={() => handleSelectMethod('email')}
                className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] hover:bg-[var(--glass-surface-strong)] transition-all text-left group active-press"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                    {t('pinSettings.emailOtpTitle')}
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)]">{t('pinSettings.emailOtpDesc')}</p>
                </div>
              </button>

              {/* WhatsApp / Telegram OTP */}
              <button
                type="button"
                onClick={() => handleSelectMethod('whatsapp')}
                className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] hover:bg-[var(--glass-surface-strong)] transition-all text-left group active-press"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                    {t('pinSettings.waOtpTitle')}
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)]">{t('pinSettings.waOtpDesc')}</p>
                </div>
              </button>

              {/* Current PIN */}
              <button
                type="button"
                onClick={() => handleSelectMethod('current_pin')}
                className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] hover:bg-[var(--glass-surface-strong)] transition-all text-left group active-press"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                    {t('pinSettings.currentPinTitle')}
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)]">{t('pinSettings.currentPinDesc')}</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Eksekusi Verifikasi */}
        {step === 'verify' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setStep('choose_method')}
              className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1 font-medium"
            >
              <ArrowLeft size={14} />
              <span>{t('pinSettings.changeMethod')}</span>
            </button>

            {/* Sub-UI: GitHub */}
            {method === 'github' && (
              <div className="p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg border border-slate-700">
                  <GithubIcon size={28} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{t('pinSettings.githubVerifyTitle')}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {t('pinSettings.githubVerifyDesc')}
                  </p>
                </div>
                <Button variant="primary" onClick={handleVerifyStep} isLoading={loading} className="w-full">
                  {t('pinSettings.githubVerifyBtn')}
                </Button>
              </div>
            )}

            {/* Sub-UI: Email / WhatsApp OTP */}
            {(method === 'email' || method === 'whatsapp') && (
              <div className="p-5 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                    {t('pinSettings.otpTargetLabel')}
                  </label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={targetContact}
                      onChange={(e) => setTargetContact(e.target.value)}
                      placeholder={method === 'email' ? t('pinSettings.placeholderEmail') : t('pinSettings.placeholderPhone')}
                      className="text-sm"
                    />
                    <Button
                      variant="secondary"
                      onClick={handleSendOtp}
                      isLoading={loading}
                      leftIcon={<Send size={14} />}
                      className="shrink-0 text-xs"
                    >
                      {t('pinSettings.sendOtpBtn')}
                    </Button>
                  </div>
                </div>

                {isOtpSent && (
                  <div className="space-y-3 pt-2 animate-fade-in border-t border-[var(--glass-border)]">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                        {t('pinSettings.otpCodeLabel')}
                      </label>
                      <Input
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.slice(0, 6))}
                        placeholder={t('pinSettings.otpCodePlaceholder')}
                        maxLength={6}
                        className="text-center tracking-widest font-mono text-lg mt-1"
                      />
                    </div>

                    <Button variant="primary" onClick={handleVerifyStep} isLoading={loading} className="w-full">
                      {t('pinSettings.confirmOtpBtn')}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Sub-UI: Current PIN */}
            {method === 'current_pin' && (
              <div className="p-5 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                    {t('pinSettings.currentPinLabel')}
                  </label>
                  <Input
                    type="password"
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value.slice(0, 4))}
                    placeholder={t('pinSettings.currentPinPlaceholder')}
                    maxLength={4}
                    className="text-center tracking-widest font-mono text-xl mt-1"
                  />
                </div>
                <Button variant="primary" onClick={handleVerifyStep} isLoading={loading} className="w-full">
                  {t('pinSettings.verifyPinBtn')}
                </Button>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 font-medium flex items-center justify-center gap-1 animate-fade-in">
                <AlertCircle size={14} />
                <span>{error}</span>
              </p>
            )}
          </div>
        )}

        {/* STEP 3: Buat & Konfirmasi PIN Baru */}
        {step === 'new_pin' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{t('pinSettings.identityVerified')}</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                  {t('pinSettings.newPinLabel')}
                </label>
                <Input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder={t('pinSettings.newPinPlaceholder')}
                  maxLength={4}
                  className="text-center tracking-widest font-mono text-xl mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                  {t('pinSettings.confirmPinLabel')}
                </label>
                <Input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder={t('pinSettings.confirmPinPlaceholder')}
                  maxLength={4}
                  className="text-center tracking-widest font-mono text-xl mt-1"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 font-medium flex items-center justify-center gap-1 animate-fade-in">
                <AlertCircle size={14} />
                <span>{error}</span>
              </p>
            )}

            <Button variant="primary" onClick={handleSaveNewPin} className="w-full">
              {t('pinSettings.saveNewPinBtn')}
            </Button>
          </div>
        )}

        {/* STEP 4: Sukses */}
        {step === 'success' && (
          <div className="text-center space-y-4 py-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[var(--text-primary)]">
                {t('pinSettings.successTitle')}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {t('pinSettings.successSub')}
              </p>
            </div>
            <Button variant="primary" onClick={handleClose} className="w-full">
              {t('pinSettings.doneBtn')}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
