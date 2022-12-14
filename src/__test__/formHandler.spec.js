import { handleSubmit } from "../client/js/formHandler";

describe("Testing the handleSubmit functionality", () => {
  test("Testing whether handleSubmit function exist or not", () => {
    expect(handleSubmit).toBeDefined();
  });
});
