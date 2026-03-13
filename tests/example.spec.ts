import { test, expect } from "@playwright/test";

test("can browse products, open detail, and manage favorites", async ({
  page,
}) => {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

  await page.goto(baseURL);

  await page.getByRole("link", { name: /start browsing products/i }).click();
  await expect(page).toHaveURL(/\/products/);

  const firstCard = page.getByRole("link", { name: /view/i }).first();
  await firstCard.click();

  await expect(
    page.getByRole("heading", { level: 2 }),
  ).toBeVisible();

  const favoriteButton = page.getByRole("button", {
    name: /add to favorites|remove from favorites/i,
  });
  await favoriteButton.click();

  await page.getByRole("link", { name: /favorites/i }).click();
  await expect(page).toHaveURL(/\/favorites/);
  await expect(
    page.getByText(/products you have marked as favorites/i),
  ).toBeVisible();
});
