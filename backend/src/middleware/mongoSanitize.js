/**
 * Deep NoSQL Injection Defense Middleware
 * Recursively strips keys containing '$' or '.' to prevent MongoDB operator injection.
 */
const sanitizeObject = (target) => {
  if (!target || typeof target !== "object") return target;

  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      target[i] = sanitizeObject(target[i]);
    }
    return target;
  }

  for (const key of Object.keys(target)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete target[key];
    } else {
      target[key] = sanitizeObject(target[key]);
    }
  }

  return target;
};

export const mongoSanitizer = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
};

export default mongoSanitizer;
