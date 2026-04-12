import React, { useRef, useState } from 'react';
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { useTranslation } from '../../../hooks/useTranslation';
import {
  isAuthConfigured,
  createRecaptchaVerifier,
  sendPhoneCode,
  confirmPhoneCode,
} from '../../../firebase-auth';
import styles from './styles.module.css';

type Step = 'idle' | 'phone' | 'code';

const PhoneAuth: React.FC = () => {
  const { t } = useTranslation();

  const [step, setStep] = useState<Step>('idle');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  if (!isAuthConfigured()) return null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = createRecaptchaVerifier('recaptcha-container');
      }
      confirmationRef.current = await sendPhoneCode(phone, recaptchaRef.current);
      setStep('code');
    } catch {
      setError(t('contact.sendError'));
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationRef.current) return;
    setBusy(true);
    setError(null);
    try {
      await confirmPhoneCode(confirmationRef.current, code);
      // onAuthStateChanged in useAuth will update the store token
      setStep('idle');
      setCode('');
    } catch {
      setError(t('contact.verifyError'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Invisible reCAPTCHA anchor */}
      <div id="recaptcha-container" />

      {step === 'phone' ? (
        <form onSubmit={handleSendCode} className={styles['phone-auth__form']}>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder={t('contact.phonePlaceholder')}
            className={styles['phone-auth__input']}
            autoFocus
            required
          />
          <button type="submit" disabled={busy || !phone} className={styles['phone-auth__button--action']}>
            {busy ? t('contact.sending') : t('contact.sendCode')}
          </button>
          <button
            type="button"
            onClick={() => { setStep('idle'); setError(null); }}
            className={styles['phone-auth__button--cancel']}
          >
            {t('contact.cancel')}
          </button>
          {error && <span className={styles['phone-auth__error']}>{error}</span>}
        </form>

      ) : step === 'code' ? (
        <form onSubmit={handleVerifyCode} className={styles['phone-auth__form']}>
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder={t('contact.codePlaceholder')}
            className={styles['phone-auth__input']}
            autoFocus
            required
          />
          <button type="submit" disabled={busy || !code} className={styles['phone-auth__button--action']}>
            {busy ? t('contact.verifying') : t('contact.verify')}
          </button>
          <button
            type="button"
            onClick={() => { setStep('phone'); setCode(''); setError(null); }}
            className={styles['phone-auth__button--cancel']}
          >
            {t('contact.back')}
          </button>
          {error && <span className={styles['phone-auth__error']}>{error}</span>}
        </form>

      ) : (
        <button onClick={() => setStep('phone')} className={styles['phone-auth__trigger']}>
          📞 {t('contact.viewContact')}
        </button>
      )}
    </>
  );
};

export default PhoneAuth;
