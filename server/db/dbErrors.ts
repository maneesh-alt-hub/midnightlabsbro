export const isDatabaseUnavailable = (error: unknown) => {
  const possibleDbError = error as { code?: string; errors?: Array<{ code?: string }> };
  return possibleDbError.code === 'ECONNREFUSED' || possibleDbError.errors?.some((item) => item.code === 'ECONNREFUSED') === true;
};
