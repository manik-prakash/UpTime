// Integration test - needs a real Postgres instance (see docker-compose.yml / CI service container)
// with migrations applied.
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { prisma } from "@repo/db/client";
import { app } from "./app.js";

const testEmail = `api-test-${Date.now()}@example.com`;
const testPassword = "Testpass123!";

let token: string;

afterAll(async () => {
    const user = await prisma.user.findUnique({ where: { email: testEmail } });
    if (user) {
        await prisma.websiteTick.deleteMany({ where: { website: { userId: user.id } } });
        await prisma.website.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
    }
});

describe("auth", () => {
    it("rejects signup with an invalid password", async () => {
        const res = await request(app)
            .post("/auth/signup")
            .send({ email: "someone@example.com", password: "weak" });

        expect(res.status).toBe(400);
    });

    it("signs up a new user", async () => {
        const res = await request(app)
            .post("/auth/signup")
            .send({ email: testEmail, password: testPassword });

        expect(res.status).toBe(201);
        expect(res.body.token).toBeTruthy();
        token = res.body.token;
    });

    it("rejects a duplicate signup with 409, not a raw 500", async () => {
        const res = await request(app)
            .post("/auth/signup")
            .send({ email: testEmail, password: testPassword });

        expect(res.status).toBe(409);
    });

    it("rejects signin with the wrong password", async () => {
        const res = await request(app)
            .post("/auth/signin")
            .send({ email: testEmail, password: "WrongPass123!" });

        expect(res.status).toBe(401);
    });

    it("signs in with the correct credentials", async () => {
        const res = await request(app)
            .post("/auth/signin")
            .send({ email: testEmail, password: testPassword });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeTruthy();
    });
});

describe("website routes (protected)", () => {
    it("rejects requests with no token", async () => {
        const res = await request(app).get("/api/websites");
        expect(res.status).toBe(401);
    });

    it("rejects requests with a garbage token", async () => {
        const res = await request(app)
            .get("/api/websites")
            .set("Authorization", "Bearer garbage.token.value");
        expect(res.status).toBe(403);
    });

    let websiteId: string;
    const websiteUrl = `https://api-integration-test-${Date.now()}.example.com`;

    it("creates a website for the authenticated user", async () => {
        const res = await request(app)
            .post("/api/website")
            .set("Authorization", `Bearer ${token}`)
            .send({ url: websiteUrl });

        expect(res.status).toBe(201);
        expect(res.body.id).toBeTruthy();
        websiteId = res.body.id;
    });

    it("rejects creating the same website URL twice with 409", async () => {
        const res = await request(app)
            .post("/api/website")
            .set("Authorization", `Bearer ${token}`)
            .send({ url: websiteUrl });

        expect(res.status).toBe(409);
    });

    it("lists the created website", async () => {
        const res = await request(app)
            .get("/api/websites")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.websites.some((w: { id: string }) => w.id === websiteId)).toBe(true);
    });

    it("gets the website by id", async () => {
        const res = await request(app)
            .get(`/api/website/${websiteId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.website.id).toBe(websiteId);
    });

    it("deletes the website", async () => {
        const res = await request(app)
            .delete(`/api/website/${websiteId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

    it("404s fetching the now-deleted website", async () => {
        const res = await request(app)
            .get(`/api/website/${websiteId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
    });
});
