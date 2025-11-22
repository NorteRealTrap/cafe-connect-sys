import { describe, it, expect } from 'vitest';
import { validatePassword, validateEmail, sanitizeForLogs, sanitizeForDisplay } from './security';

describe('Security Utils', () => {
  describe('validatePassword', () => {
    it('aceita senha válida', () => {
      expect(validatePassword('Test@123')).toBe(true);
    });

    it('rejeita senha sem maiúscula', () => {
      expect(validatePassword('test@123')).toBe(false);
    });

    it('rejeita senha sem número', () => {
      expect(validatePassword('Test@abc')).toBe(false);
    });

    it('rejeita senha sem caractere especial', () => {
      expect(validatePassword('Test1234')).toBe(false);
    });

    it('rejeita senha curta', () => {
      expect(validatePassword('Te@1')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('aceita email válido', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    it('rejeita email sem @', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    it('rejeita email sem domínio', () => {
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('sanitizeForLogs', () => {
    it('remove quebras de linha', () => {
      expect(sanitizeForLogs('test\nline')).toBe('test line');
    });

    it('limita tamanho', () => {
      const long = 'a'.repeat(2000);
      expect(sanitizeForLogs(long).length).toBe(1000);
    });

    it('trata null/undefined', () => {
      expect(sanitizeForLogs(null)).toBe('');
      expect(sanitizeForLogs(undefined)).toBe('');
    });
  });

  describe('sanitizeForDisplay', () => {
    it('escapa HTML', () => {
      expect(sanitizeForDisplay('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });

    it('limita tamanho', () => {
      const long = 'a'.repeat(1000);
      expect(sanitizeForDisplay(long).length).toBe(500);
    });
  });
});
