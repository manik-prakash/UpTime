import { describe, it, expect, vi } from "vitest";
import { Prisma } from "@repo/db/client";
import { errorHandler } from "./errorHandler.js";
import type { Request, Response } from "express";

function mockRes() {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
}

describe("errorHandler", () => {
    it("maps a P2002 unique constraint error to 409", () => {
        const err = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
            code: "P2002",
            clientVersion: "7.3.0",
        });
        const res = mockRes();

        errorHandler(err, {} as Request, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: "A record with these details already exists" });
    });

    it("does not treat a non-P2002 Prisma error as a conflict", () => {
        const err = new Prisma.PrismaClientKnownRequestError("Foreign key violation", {
            code: "P2003",
            clientVersion: "7.3.0",
        });
        const res = mockRes();
        vi.spyOn(console, "error").mockImplementation(() => {});

        errorHandler(err, {} as Request, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(500);
    });

    it("maps an unexpected error to a generic 500 without leaking details", () => {
        const err = new Error("some internal secret detail");
        const res = mockRes();
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        errorHandler(err, {} as Request, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
        expect(JSON.stringify((res.json as any).mock.calls[0][0])).not.toContain("secret detail");

        consoleSpy.mockRestore();
    });
});
