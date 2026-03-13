import { test, expect } from "@playwright/test"

test("products portal smoke: can open, search, and open dialogs", async ({ page }) => {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000"

  await page.goto(`${baseURL}/portal/products`)

  await expect(page.getByRole("heading", { name: /products portal/i })).toBeVisible()

  const search = page.getByPlaceholder("Search products...")
  await search.click()
  await search.fill("iphone")

  // Debounce + network.
  await page.waitForTimeout(600)

  await expect(page.getByText(/showing/i)).toBeVisible()

  await page.getByRole("button", { name: /add product/i }).click()
  await expect(page.getByText(/add new product/i)).toBeVisible()
})

