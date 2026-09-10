import { fail } from "../utils/response.js";

/**
 * Middleware factory that restricts access to users whose
 * decoded JWT contains at least one of the specified roles.
 *
 * Must be placed **after** `authMiddleware` so that `req.user`
 * is already populated from the verified token.
 *
 * @param  {...string} roles – allowed role names (e.g. "admin")
 * @returns {import("express").RequestHandler}
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user?.role) {
      return fail(res, "Forbidden: no role assigned", 403);
    }

    if (!roles.includes(req.user.role)) {
      return fail(res, "Forbidden: insufficient permissions", 403);
    }

    return next();
  };
}
