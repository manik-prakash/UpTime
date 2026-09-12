import { describe, it, expect } from "vitest";
import { authSchema, createWebsiteSchema, getWebsiteParamsSchema } from "./types.js";

describe("authSchema", () => {
    it("accepts a valid email and password", () => {
        const result = authSchema.safeParse({ email: "test@example.com", password: "Abc123!@#" });
        expect(result.success).toBe(true);
    });

    it("rejects an invalid email", () => {
        const result = authSchema.safeParse({ email: "not-an-email", password: "Abc123!@#" });
        expect(result.success).toBe(false);
    });

    it("rejects a password under 6 characters", () => {
        const result = authSchema.safeParse({ email: "test@example.com", password: "A1!ab" });
        expect(result.success).toBe(false);
    });

    it("rejects a password with no letter", () => {
        const result = authSchema.safeParse({ email: "test@example.com", password: "123456!" });
        expect(result.success).toBe(false);
    });

    it("rejects a password with no number", () => {
        const result = authSchema.safeParse({ email: "test@example.com", password: "abcdef!" });
        expect(result.success).toBe(false);
    });

    it("rejects a password with no special character", () => {
        const result = authSchema.safeParse({ email: "test@example.com", password: "abcdef1" });
        expect(result.success).toBe(false);
    });

    it("rejects a password over 72 characters (bcrypt truncation guard)", () => {
        const longPassword = "Aa1!" + "a".repeat(70);
        expect(longPassword.length).toBeGreaterThan(72);
        const result = authSchema.safeParse({ email: "test@example.com", password: longPassword });
        expect(result.success).toBe(false);
    });

    it("accepts a password at exactly 72 characters", () => {
        const password = "Aa1!" + "a".repeat(68);
        expect(password.length).toBe(72);
        const result = authSchema.safeParse({ email: "test@example.com", password });
        expect(result.success).toBe(true);
    });
});

describe("createWebsiteSchema", () => {
    it("accepts a valid https URL", () => {
        const result = createWebsiteSchema.safeParse({ url: "https://example.com" });
        expect(result.success).toBe(true);
    });

    it("rejects a non-URL string", () => {
        const result = createWebsiteSchema.safeParse({ url: "not a url" });
        expect(result.success).toBe(false);
    });

    it("rejects a missing url field", () => {
        const result = createWebsiteSchema.safeParse({});
        expect(result.success).toBe(false);
    });
});

describe("getWebsiteParamsSchema", () => {
    it("accepts a valid UUID", () => {
        const result = getWebsiteParamsSchema.safeParse({ websiteId: "123e4567-e89b-12d3-a456-426614174000" });
        expect(result.success).toBe(true);
    });

    it("rejects a non-UUID string", () => {
        const result = getWebsiteParamsSchema.safeParse({ websiteId: "not-a-uuid" });
        expect(result.success).toBe(false);
    });
});
