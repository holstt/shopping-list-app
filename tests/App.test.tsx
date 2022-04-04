import App from "../src/App";
// import renderer from "react-test-renderer";
import { render, waitFor } from "@testing-library/react-native";

it("should be able to render", async () => {
  // Start rendering component
  const { findByTestId } = render(<App />);

  // Wait for correct component to appear
  const navigator = await findByTestId("root-view");
  expect(navigator).toBeTruthy();
});
