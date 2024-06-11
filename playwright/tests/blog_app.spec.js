const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
    await expect(page.getByRole("button"), { name: "login" }).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "einiinsalainen");

      const errorDiv = await page.locator(".error");
      await expect(errorDiv).toContainText("wrong username or password");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(
        page.getByText("Matti Luukkainen logged in")
      ).not.toBeVisible();
    });
  });

  describe("When logged in ", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "test title", "test author", "http://testurl.com");

      await expect(page.getByText("test title test author")).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(page, "test title", "test author", "http://testurl.com");
      await expect(page.getByText("test title test author")).toBeVisible();

      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByText("likes 0")).toBeVisible();
      await page.getByRole("button", { name: "like" }).click();

      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("user can delete a blog they've added", async ({ page }) => {
      await createBlog(page, "test title", "test author", "http://testurl.com");
      await expect(page.getByText("test title test author")).toBeVisible();

      page.on("dialog", (dialog) => {
        expect(dialog.type()).toContain("confirm");
        expect(dialog.message()).toContain(
          "Remove blog test title by test author"
        );
        dialog.accept();
      });

      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "delete" }).click();

      const successDiv = await page.locator(".success");
      await expect(successDiv).toContainText("blog deleted successfully");
      await expect(successDiv).toHaveCSS("border-style", "solid");
      await expect(successDiv).toHaveCSS("color", "rgb(0, 128, 0)");

      await expect(page.getByText("test title test author")).not.toBeVisible();
    });

    test("delete button is shown only to user who created the blog", async ({
      page,
      request,
    }) => {
      await createBlog(page, "test title", "test author", "http://testurl.com");
      await expect(page.getByText("test title test author")).toBeVisible();
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByRole("button", { name: "delete" })).toBeVisible();
      await page.getByRole("button", { name: "logout" }).click();

      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "Test User",
          username: "testuser",
          password: "testuser",
        },
      });
      await loginWith(page, "testuser", "testuser");
      await page.getByRole("button", { name: "view" }).click();
      await expect(
        page.getByRole("button", { name: "delete" })
      ).not.toBeVisible();
    });
  });
});
