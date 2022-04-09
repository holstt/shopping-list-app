import App from "../src/App";
// import renderer from "react-test-renderer";
import { render, waitFor } from "@testing-library/react-native";

it("renders correctly", async () => {
  // Start rendering component
  const component = render(<App />);

  await component.findByText("Item1");
  expect(component.toJSON()).toMatchSnapshot();
});
