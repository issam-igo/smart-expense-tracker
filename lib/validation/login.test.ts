import { describe, expect, it } from "vitest";
import { loginSchema } from "@/lib/validation/login";

describe("loginSchema", () => {
  it("accepte des données valides", () => {
    const result = loginSchema.safeParse({
      email: "issam@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("refuse un email invalide", () => {
    const result = loginSchema.safeParse({
      email: "pas-un-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe vide", () => {
    const result = loginSchema.safeParse({
      email: "issam@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});
