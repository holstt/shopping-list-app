import React from "react";
import renderer from "react-test-renderer";
import MyComponent from "../src/MyComponent";
import CheckListScreen from "../src/screens/ChecklistScreen";

// import App from "../src/App";
// import CheckListScreen from "../src/screens/ChecklistScreen";

// jest.mock("@expo/vector-icons/FontAwesome", () => "Icon");
// jest.mock("@expo/vector-icons", () => ({
//   FontAwesome: "",
//   Feather: "",
// }));

// describe("MyComponent", () => {
//   it("Has 1 child", () => {
//     const tree = renderer
//       .create(<MyComponent input="hej"></MyComponent>)
//       .toJSON();

//     //@ts-ignore
//     expect(tree.children.length).toBe(1);
//   });
// });

const navigation: any = {};
const route: any = {};

describe("ChecklistScreen", () => {
  it("Has 1 child", () => {
    const tree = renderer
      .create(
        <CheckListScreen
          navigation={navigation}
          route={route}
        ></CheckListScreen>
      )
      .toJSON();

    //@ts-ignore
    expect(tree.children.length).toBe(3);
  });
});
