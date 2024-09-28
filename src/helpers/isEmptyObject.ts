const isEmptyObject = (object: NonNullable<unknown>): boolean => {
  if (Object.keys(object).length === 0) return true;
  else return false;
};

export default isEmptyObject;
