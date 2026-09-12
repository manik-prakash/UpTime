import { describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { verify } from "./verify.js";
import type { Request, Response } from "express";

function mockRes() {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
}

function mockReq(authHeader?: string): Request {
    return { headers: authHeader ? { authorization: authHeader } : {} } as unknown as Request;
}

const secret = process.env.JWT_SECRET_WORD!;

describe("verify middleware", () => {
    it("rejects a request with no token", () => {
        const res = mockRes();
        const next = vi.fn();

        verify(mockReq(), res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it("rejects a garbage token", () => {
        const res = mockRes();
        const next = vi.fn();
        vi.spyOn(console, "error").mockImplementation(() => {});

        verify(mockReq("Bearer garbage.token.value"), res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it("rejects an expired token", () => {
        const token = jwt.sign({ userID: "abc" }, secret, { algorithm: "HS256", expiresIn: -10 });
        const res = mockRes();
        const next = vi.fn();
        vi.spyOn(console, "error").mockImplementation(() => {});

        verify(mockReq(`Bearer ${token}`), res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it("rejects a token signed with a different secret", () => {
        const token = jwt.sign({ userID: "abc" }, "wrong-secret", { algorithm: "HS256" });
        const res = mockRes();
        const next = vi.fn();
        vi.spyOn(console, "error").mockImplementation(() => {});

        verify(mockReq(`Bearer ${token}`), res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it("accepts a valid token and attaches userID to req.body", () => {
        const token = jwt.sign({ userID: "user-123" }, secret, { algorithm: "HS256", expiresIn: "1h" });
        const req = mockReq(`Bearer ${token}`);
        const res = mockRes();
        const next = vi.fn();

        verify(req, res, next);

        expect(next).toHaveBeenCalled();
        expect((req.body as { userID: string }).userID).toBe("user-123");
    });
});
