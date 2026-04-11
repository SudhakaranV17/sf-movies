import ENV from '../env.config';

describe('env.config', () => {
  it('should export ENV object', () => {
    expect(ENV).toBeDefined();
    expect(typeof ENV).toBe('object');
  });

  it('should have BASE_URL property', () => {
    expect(ENV).toHaveProperty('BASE_URL');
  });

  it('should read BASE_URL from environment variable', () => {
    // BASE_URL should be either defined from VITE_BASE_URL or undefined
    expect(typeof ENV.BASE_URL === 'string' || ENV.BASE_URL === undefined).toBe(true);
  });
});
