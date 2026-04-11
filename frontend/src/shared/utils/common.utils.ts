/**
 * Delay execution of a function until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * Returns the debounced function with a `.cancel()` method to abort any
 * pending invocation (useful for clearing on unmount or explicit reset).
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}