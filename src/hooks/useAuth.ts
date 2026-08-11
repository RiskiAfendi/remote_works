'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_PIN_ENABLED_KEY = 'rw_pin_enabled';
const STORAGE_PIN_CODE_KEY = 'rw_pin_code';
const DEFAULT_PIN = '1234';

export interface UseAuthReturn {
  isLocked: boolean;
  isPinEnabled: boolean;
  hasPinSet: boolean;
  unlock: (pin: string) => boolean;
  lock: () => void;
  setPinCode: (oldPin: string, newPin: string) => boolean;
  togglePinProtection: (enabled: boolean, pinConfirmation?: string) => boolean;
  resetToDefaultPin: () => void;
}

/**
 * Custom Hook untuk pengelola autentikasi PIN lokal sederhana.
 * Cocok untuk proteksi personal dashboard tanpa memerlukan backend.
 */
export function useAuth(): UseAuthReturn {
  const [isPinEnabled, setIsPinEnabled] = useState<boolean>(false);
  const [pinCode, setPinCodeState] = useState<string>(DEFAULT_PIN);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load status awal dari localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedEnabled = localStorage.getItem(STORAGE_PIN_ENABLED_KEY);
    const savedPin = localStorage.getItem(STORAGE_PIN_CODE_KEY);

    const enabled = savedEnabled ? savedEnabled === 'true' : false;
    const code = savedPin && savedPin.length === 4 ? savedPin : DEFAULT_PIN;

    setIsPinEnabled(enabled);
    setPinCodeState(code);
    setIsLocked(enabled); // Kunci otomatis jika PIN diaktifkan
    setIsInitialized(true);
  }, []);

  // Simpan PIN code ke localStorage jika berubah
  const savePinCode = (code: string) => {
    setPinCodeState(code);
    localStorage.setItem(STORAGE_PIN_CODE_KEY, code);
  };

  // Simpan status PIN enabled ke localStorage
  const savePinEnabled = (enabled: boolean) => {
    setIsPinEnabled(enabled);
    localStorage.setItem(STORAGE_PIN_ENABLED_KEY, String(enabled));
  };

  // Verifikasi dan buka kunci
  const unlock = useCallback(
    (pin: string): boolean => {
      if (pin === pinCode) {
        setIsLocked(false);
        return true;
      }
      return false;
    },
    [pinCode]
  );

  // Kunci dashboard secara manual
  const lock = useCallback(() => {
    if (isPinEnabled) {
      setIsLocked(true);
    }
  }, [isPinEnabled]);

  // Mengubah PIN
  const setPinCode = useCallback(
    (oldPin: string, newPin: string): boolean => {
      if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
        return false;
      }

      // Jika PIN sudah diset, verifikasi PIN lama
      if (isPinEnabled && oldPin !== pinCode) {
        return false;
      }

      savePinCode(newPin);
      return true;
    },
    [isPinEnabled, pinCode]
  );

  // Mengaktifkan/menonaktifkan proteksi PIN
  const togglePinProtection = useCallback(
    (enabled: boolean, pinConfirmation?: string): boolean => {
      if (enabled) {
        // Aktifkan PIN
        savePinEnabled(true);
        setIsLocked(true);
        return true;
      } else {
        // Matikan PIN, konfirmasi PIN saat ini dulu
        if (pinConfirmation === pinCode) {
          savePinEnabled(false);
          setIsLocked(false);
          return true;
        }
        return false;
      }
    },
    [pinCode]
  );

  // Reset PIN ke default
  const resetToDefaultPin = useCallback(() => {
    savePinCode(DEFAULT_PIN);
    savePinEnabled(false);
    setIsLocked(false);
  }, []);

  return {
    isLocked: isInitialized ? isLocked : false,
    isPinEnabled,
    hasPinSet: Boolean(pinCode),
    unlock,
    lock,
    setPinCode,
    togglePinProtection,
    resetToDefaultPin,
  };
}
