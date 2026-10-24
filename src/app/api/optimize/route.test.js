
import { describe, it, expect, vi, beforeEach } from "vitest";

const { generateContent } = vi.hoisted(() => ({
  generateContent: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    constructor() {
      this.models = {
        generateContent,
      };
    }
  },
}));

import { POST } from "./route";

function createRequest(body) {
  return new Request("http://localhost/api/optimize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/optimize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an optimized prompt for a valid request", async () => {
    generateContent.mockResolvedValue({
      text: "Premium studio photograph of black sneakers",
    });

    const response = await POST(
      createRequest({
        prompt: "Black sneakers",
        creativeType: "Product Ad",
        ratio: "1:1",
        style: "Premium",
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      prompt: "Premium studio photograph of black sneakers",
    });

    expect(generateContent).toHaveBeenCalledOnce();
  });

  it("returns 400 when the prompt is empty", async () => {
    const response = await POST(
      createRequest({ prompt: "   " })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Please enter your creative idea.",
    });

    expect(generateContent).not.toHaveBeenCalled();
  });

  it("returns 429 when Gemini rate limit is reached", async () => {
    generateContent.mockRejectedValue(
      Object.assign(new Error("Rate limit"), { status: 429 })
    );

    const response = await POST(
      createRequest({ prompt: "Black sneakers" })
    );

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      error:
        "Gemini rate limit reached. Please try again in a moment.",
    });
  });

  it("returns 503 when Gemini is temporarily busy", async () => {
    generateContent.mockRejectedValue(
      Object.assign(new Error("Unavailable"), { status: 503 })
    );

    const response = await POST(
      createRequest({ prompt: "Black sneakers" })
    );

    expect(response.status).toBe(503);
  });

  it("returns 401 when Gemini credentials are invalid", async () => {
    generateContent.mockRejectedValue(
      Object.assign(new Error("Unauthorized"), { status: 401 })
    );

    const response = await POST(
      createRequest({ prompt: "Black sneakers" })
    );

    expect(response.status).toBe(401);
  });

  it("returns 500 when Gemini returns an empty response", async () => {
    generateContent.mockResolvedValue({ text: "   " });

    const response = await POST(
      createRequest({ prompt: "Black sneakers" })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to generate optimized prompt.",
    });
  });
});
