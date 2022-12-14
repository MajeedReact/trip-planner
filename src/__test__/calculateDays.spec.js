import { calculateDays } from "../client/js/calculateDays";

describe("Testing the calculateDays functionality", () => {
  test("Testing whether calculateDays function exist or not", () => {
    expect(calculateDays).toBeDefined();
  });

  test("Testing days calculation function", () => {
    //minus current day from current day
    const newDate = new Date();
    expect(calculateDays(newDate)).toEqual(0);
  });
});
