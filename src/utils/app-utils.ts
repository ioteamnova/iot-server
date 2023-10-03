export const isProductionMode = process.env.NODE_ENV === 'prod';

export const isDevelopMode = process.env.NODE_ENV === 'dev';

export const isLocalMode =
  process.env.NODE_ENV === 'local' ||
  process.env.NODE_ENV === 'test' ||
  process.env.LOCAL_MODE === 'true';

export const isTestMode = process.env.NODE_ENV === 'test';
