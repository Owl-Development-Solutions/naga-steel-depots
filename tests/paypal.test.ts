import { generateAccessToken } from "../lib/paypal";

//test to generate accesstoken from paypal
test("generates token from paypal", async () => {
  const tokenResponse = await generateAccessToken();

  expect(typeof tokenResponse).toBe("string");
  expect(tokenResponse.length).toBeGreaterThan(0);
});
