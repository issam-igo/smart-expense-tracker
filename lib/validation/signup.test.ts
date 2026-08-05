import { describe, expect, it } from "vitest";
import { signupSchema } from "@/lib/validation/signup";

const validSignup = {
  name: "Issam",
  email: "issam@example.com",
  password: "password123",
  confirmPassword: "password123",
};

describe("signupSchema", () => {
  it("accepte des données valides", () => {
    expect(signupSchema.safeParse(validSignup).success).toBe(true);
  });

  it("refuse un email invalide", () => {
    const result = signupSchema.safeParse({ ...validSignup, email: "pas-un-email" });

    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe trop court", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      password: "short1",
      confirmPassword: "short1",
    });

    expect(result.success).toBe(false);
  });

  it("refuse une confirmation de mot de passe différente", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      confirmPassword: "autreMotDePasse1",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("confirmPassword");
    }
  });
});
