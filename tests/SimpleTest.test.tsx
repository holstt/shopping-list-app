import React from "react";
import renderer from "react-test-renderer";
import TestComponent from "./TestComponent";

import {
  render,
  TextMatch,
  TextMatchOptions,
  waitFor,
  fireEvent,
  FindAllReturn,
  WaitForOptions,
  RenderAPI,
  within,
} from "@testing-library/react-native";

describe("It", () => {
  it("Works", () => {
    const input = true;
    expect(input).toBeTruthy();
  });

  it("TextInput Works", () => {
    const api = render(<TestComponent></TestComponent>);
    const input = api.getByTestId("test-1");
    fireEvent.changeText(input, "hello world");
    const button = api.getByTestId("test-2");
    fireEvent(button, "onSubmitEditing", { nativeEvent: { text: "test" } });
    fireEvent(input, "onSubmitEditing", { nativeEvent: { text: "test" } });
  });
});
