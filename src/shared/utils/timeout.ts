/**
 * Creates a promise that rejects after the specified timeout
 */
export function createTimeoutPromise(timeoutMs: number, message = 'Operation timed out') {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), timeoutMs);
  });
}

/**
 * Wraps a promise with a timeout
 */
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

/**
 * Default timeouts for different operations
 */
export const TIMEOUTS = {
  AUTH: 8000,      // Authentication operations
  DATA_LOAD: 10000, // Loading data
  SUBMIT: 15000,    // Submitting forms/data
  QUICK: 5000       // Quick operations
} as const;