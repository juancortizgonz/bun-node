import type { IncomingMessage, ServerResponse } from "http";
import { verify, type JwtPayload } from "jsonwebtoken";
import { isTokenRevoked } from "../models";
import config from "../config";

export interface AuthenticatedRequest extends IncomingMessage {
    user?: JwtPayload | string;
}

/**
 * Middleware/helper function that verifies the JWT token from the
 * `Authorization` header in the request.
 *
 * - If no token is provided → responds with `401 Unauthorized`.
 * - If the token has been revoked → responds with `403 Forbidden`.
 * - If the token is valid → sets `req.user` with the decoded token and returns `true`.
 *
 * @async
 * @param {AuthenticatedRequest} req - The incoming HTTP request.
 * @param {ServerResponse} res - The HTTP response, used to send error messages if needed.
 * @returns {Promise<boolean>} Returns `true` if the token is valid, otherwise returns `false`
 * and ends the response with an appropriate error status and message.
 */
export const authenticateToken = async (
    req: AuthenticatedRequest,
    res: ServerResponse
): Promise<boolean> => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: "Unauthorized" }));
        return false;
    }

    if (isTokenRevoked(token)) {
        res.statusCode = 403;
        res.end(JSON.stringify({ message: "Forbidden" }));
        return false;
    }

    try {
        const decoded = verify(token, config.jwtSecret);
        req.user = decoded;
        return true;
    } catch (_err: any) {
        req.statusCode = 403;
        res.end(JSON.stringify({ message: "Forbidden" }));
        return false;
    }
}
