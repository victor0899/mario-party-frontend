export function createTimeoutPromise(timeoutMs: number, message = 'Operation timed out') {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), timeoutMs);
  });
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    createTimeoutPromise(timeoutMs, timeoutMessage)
  ]) as Promise<T>;
}

export const TIMEOUTS = {
  AUTH: 8000,
  DATA_LOAD: 10000,
  SUBMIT: 15000,
  QUICK: 5000
} as const;