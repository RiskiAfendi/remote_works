'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_PIN_ENABLED_KEY = 'rw_pin_enabled';
const STORAGE_PIN_CODE_KEY = 'rw_pin_code';
const DEFAULT_PIN = '1234';

export interface AuthContextType {
  isLocked: boolean;
  isPinEnabled: boolean;
  hasPinSet: boolean;
  hasCustomPinSet: boolean;
  currentPinCode: string;
  isInitialized: boolean;
  unlock: (pin: string) => boolean;
  lock: () => void;
  setPinCode: (oldPin: string, newPin: string) => boolean;
  updatePinDirectly: (newPin: string) => boolean;
  togglePinProtection: (enabled: boolean, pinConfirmation?: string) => boolean;
  resetToDefaultPin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isPinEnabled, setIsPinEnabled] = useState<boolean>(true);
  const [pinCode, setPinCodeState] = useState<string>(DEFAULT_PIN);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load status awal dari localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedEnabled = localStorage.getItem(STORAGE_PIN_ENABLED_KEY);
    const savedPin = localStorage.getItem(STORAGE_PIN_CODE_KEY);

    // Default ENABLED (true) jika belum ada setting di localStorage (pertama kali buka)
    const enabled = savedEnabled === null ? true : savedEnabled === 'true';
    const code = savedPin && savedPin.length === 4 ? savedPin : DEFAULT_PIN;

    setIsPinEnabled(enabled);
    setPinCodeState(code);
    setIsLocked(enabled); // Kunci otomatis jika PIN diaktifkan
    setIsInitialized(true);
  }, []);

  // Simpan PIN code ke localStorage
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

  // Kunci dashboard secara manual (berlaku secara global)
  const lock = useCallback(() => {
    setIsPinEnabled(true);
    localStorage.setItem(STORAGE_PIN_ENABLED_KEY, 'true');
    setIsLocked(true);
  }, []);

  // Mengubah PIN dengan memverifikasi PIN lama
  const setPinCode = useCallback(
    (oldPin: string, newPin: string): boolean => {
      if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
        return false;
      }

      if (isPinEnabled && oldPin !== pinCode) {
        return false;
      }

      savePinCode(newPin);
      return true;
    },
    [isPinEnabled, pinCode]
  );

  // Mengubah PIN secara langsung setelah lolos verifikasi eksternal/OTP
  const updatePinDirectly = useCallback((newPin: string): boolean => {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      return false;
    }
    savePinCode(newPin);
    savePinEnabled(true);
    return true;
  }, []);

  // Mengaktifkan/menonaktifkan proteksi PIN
  const togglePinProtection = useCallback(
    (enabled: boolean, pinConfirmation?: string): boolean => {
      if (enabled) {
        savePinEnabled(true);
        setIsLocked(true);
        return true;
      } else {
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

  return (
    <AuthContext.Provider
      value={{
        isLocked: isInitialized ? isLocked : false,
        isPinEnabled,
        hasPinSet: Boolean(pinCode),
        hasCustomPinSet: pinCode !== DEFAULT_PIN,
        currentPinCode: pinCode,
        isInitialized,
        unlock,
        lock,
        setPinCode,
        updatePinDirectly,
        togglePinProtection,
        resetToDefaultPin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
