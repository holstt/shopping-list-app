import React, { ReactElement, ReactNode } from "react";
// import renderer from "react-test-renderer";
import ShoppingListScreen from "../src/screens/ShoppingListScreen";
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
import ShoppingListsContextProvider from "../src/state/ShoppingListsContextProvider";
import CategoriesContextProvider from "../src/state/CategoriesContextProvider";
import LibraryItemsContextProvider from "../src/state/LibraryItemsContextProvider";
import ShoppingItem from "../src/models/ShoppingItem";
import uuid from "react-native-uuid";
import ShoppingList from "../src/models/ShoppingList";
import { ReactTestInstance } from "react-test-renderer";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// jest.mock("react-native-uuid", () => ({ v4: () => "mockid" }));

function showType(comp: any) {
  expect(comp.type.displayName).toBe(1);
}

const navigation: any = {};
const route: any = {};

// XXX: Find library som AutoFixture to aut. data
const data = {
  categories: [],
  shoppingLists: [
    new ShoppingList("TestList1", [ShoppingItem.fromNew("TestItem1", 0)], 0),
    new ShoppingList("TestList2", [ShoppingItem.fromNew("TestItem2", 1)], 1),
  ],
  libraryItems: [],
};

const wrapInContexts = (component: ReactElement): ReactElement => (
  <CategoriesContextProvider initCategories={data.categories}>
    <ShoppingListsContextProvider
      initialCurrentListId={data.shoppingLists[1].id}
      initialShoppingLists={data.shoppingLists}
    >
      <LibraryItemsContextProvider initLibraryItems={data.libraryItems}>
        {component}
      </LibraryItemsContextProvider>
    </ShoppingListsContextProvider>
  </CategoriesContextProvider>
);

describe("ShoppingListScreen", () => {
  let renderApi: RenderAPI;

  beforeEach(() => {
    const checklist = wrapInContexts(
      <ShoppingListScreen
        navigation={navigation}
        route={route}
      ></ShoppingListScreen>
    );
    renderApi = render(checklist);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render correct list title", () => {
    expect(renderApi.getByText("TestList2").props.children).toBe("TestList2");
  });

  it("should render correct item title", () => {
    expect(renderApi.getByText("TestItem2").props.children).toBe("TestItem2");
  });

  // XXX: Opdel dette
  it("should be able to add and render new item", () => {
    const plusButton = renderApi.getByTestId("add-item-button");
    fireEvent.press(plusButton);
    const input = renderApi.getByPlaceholderText("Add Item");
    fireEvent(input, "onSubmitEditing", { nativeEvent: { text: "ItemToAdd" } });
    // Ensure still in add item mode
    renderApi.getByPlaceholderText("Add Item");
    // Ensure item added to list
    expect(renderApi.queryByText("ItemToAdd")).toBeTruthy();
    // Exit add mode
    fireEvent(input, "onBlur");
    // Ensure add item mode exited
    expect(renderApi.queryByPlaceholderText("Add Item")).toBeNull();
    // Expect initial save + 1 to add the new item  // XXX: Skal andet sted
    expect(AsyncStorage.multiSet).toBeCalledTimes(2);
  });

  // // XXX: Opdel dette
  it("should be able to edit and render edited item", () => {
    const existingItem = renderApi.getByText("TestItem2");
    // Pres on item to edit
    fireEvent.press(existingItem);
    // Grab from text input
    const input = renderApi.getByDisplayValue("TestItem2");
    // Fire render event
    fireEvent(input, "onSubmitEditing", {
      nativeEvent: { text: "EditedItem" },
    });

    // Ensure not in add item mode
    expect(renderApi.queryByDisplayValue("TestItem2")).toBeNull();
    // Expect item with new title in list
    expect(renderApi.queryByText("EditedItem")).toBeTruthy();
    // Expect initial save + 1 to add the new item  // XXX: Skal andet sted
    expect(AsyncStorage.multiSet).toBeCalledTimes(2);
  });
});
