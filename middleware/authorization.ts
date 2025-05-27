import type { ServerResponse } from "http";
import type { AuthenticatedRequest } from "./authentication";
import type { User } from "../models";

/**
 * Middleware factory that checks if the authenticated user's role is authorized.
 * 
 * @param {...string[]} roles - The list of roles authorized to access the route.
 * @returns {Function} A middleware function that checks user role and returns `true` if authorized, `false` otherwise.
 */
export const authorizeRoles = (...roles: string[]) => {
    return async (
        req: AuthenticatedRequest,
        res: ServerResponse
    ): Promise<boolean> => {
        const userRole = (req.user as User).role;

        if (!userRole || !roles.includes(userRole)) {
            res.statusCode = 403;
            res.end(JSON.stringify({ message: "Forbidden" }));
            return false;
        }

        return true;
    }
}
