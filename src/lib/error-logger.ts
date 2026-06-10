import { convexMutation } from './convex-client';

type LogLevel = 'error' | 'warn' | 'info';

async function writeLog(level: LogLevel, context: string, message: string, details?: unknown) {
  const detailStr =
    details !== undefined
      ? typeof details === 'string'
        ? details
        : JSON.stringify(details, null, 0)
      : undefined;

  convexMutation('errorLogs:log', {
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
    details: detailStr,
  }).catch(() => {});
}

export function logError(context: string, message: string, details?: unknown) {
  console.error(`[${context}] ${message}`, details ?? '');
  writeLog('error', context, message, details);
}

export function logWarn(context: string, message: string, details?: unknown) {
  console.warn(`[${context}] ${message}`, details ?? '');
  writeLog('warn', context, message, details);
}

export function logInfo(context: string, message: string, details?: unknown) {
  console.log(`[${context}] ${message}`, details ?? '');
  writeLog('info', context, message, details);
}
