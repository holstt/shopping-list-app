import React from "react";
import renderer from "react-test-renderer";
import MyComponent from "../src/MyComponent";

describe("SimpleTest", () => {
  it("Works", () => {
    const input = true;
    expect(input).toBeTruthy();
  });
});
