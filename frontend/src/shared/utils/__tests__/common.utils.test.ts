import { debounce } from '../common.utils';

describe('debounce', () => {
  jest.useFakeTimers();

  it('delays function execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn('test');
    
    expect(mockFn).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(500);
    
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('cancels previous calls when called multiple times', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn('first');
    jest.advanceTimersByTime(200);
    
    debouncedFn('second');
    jest.advanceTimersByTime(200);
    
    debouncedFn('third');
    jest.advanceTimersByTime(500);
    
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  it('can be cancelled', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn('test');
    debouncedFn.cancel();
    
    jest.advanceTimersByTime(500);
    
    expect(mockFn).not.toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});
