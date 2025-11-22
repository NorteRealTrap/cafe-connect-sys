type LogLevel = 'info' | 'warn' | 'error';

interface LogData {
  [key: string]: any;
}

/**
 * Logger estruturado simples
 * Para produção, usar Winston ou Pino
 */
export const logger = {
  info(message: string, data?: LogData) {
    this.log('info', message, data);
  },

  warn(message: string, data?: LogData) {
    this.log('warn', message, data);
  },

  error(message: string, data?: LogData) {
    this.log('error', message, data);
  },

  log(level: LogLevel, message: string, data?: LogData) {
    const logEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...data,
    };

    const logFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    logFn(JSON.stringify(logEntry));

    // Em produção, enviar para Sentry/DataDog
    if (level === 'error' && typeof window !== 'undefined') {
      // Integração com Sentry aqui
    }
  },
};
