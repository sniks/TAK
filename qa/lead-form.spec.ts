import { expect, test } from "@playwright/test"

test("home hero lead form persists a callback request", async ({ page }) => {
  test.setTimeout(60000)
  await page.goto("http://127.0.0.1:3000")
  const timestamp = Date.now()

  await page.getByPlaceholder("Enter your full name").first().fill(`QA Lead ${timestamp}`)
  await page.getByPlaceholder("Enter mobile number").first().fill("9999999999")
  await page.getByPlaceholder("Enter email address").first().fill(`qa-${timestamp}@example.com`)
  await page.getByPlaceholder("Select city").first().fill("Ahmedabad")
  await page.getByLabel("I agree to be contacted by Taakshvi Solution Hub regarding my enquiry.").first().check()
  await page.locator("form").first().getByRole("button", { name: /Request a Callback/i }).click()

  await expect(page.getByText("Your enquiry has been received. Our team will contact you shortly.")).toBeVisible()
})
