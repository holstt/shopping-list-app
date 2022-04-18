import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  Dispatch,
} from "react";
import Category from "../models/Category";
import ShoppingItem from "../models/ShoppingItem";
import { useNavigationContext } from "./NavigationContext";

interface ShoppingListUiState {
  state: State;
  dispatch: Dispatch<UiAction>;
}

export const ShoppingListUIContext = createContext<ShoppingListUiState | null>(
  null
);

export function useShoppingListUIContext() {
  const context = useContext(ShoppingListUIContext);

  if (!context) {
    throw new Error(
      "Component was not wrapped in the required context provider: ShoppingListUIContext"
    );
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export enum InputMode {
  NONE,
  ADD,
  EDIT,
}

export interface State {
  inputMode: InputMode;
  selectedCategory: Category | null;
  editItem: ShoppingItem | null; // XXX: Kun hvis edit mode. Bedre løsning?
}

// Define possible types.
export type UiAction =
  | { type: "ADD_ITEM_STARTED" }
  | { type: "ADD_ITEM_ENDED" }
  | { type: "EDIT_ITEM_STARTED"; item: ShoppingItem }
  | { type: "EDIT_ITEM_ENDED" }
  | { type: "CATEGORY_SELECTED"; category: Category };

//   return prev?.id !== category?.id ? category : null;

function shoppingListUiContextReducer(state: State, action: UiAction): State {
  console.log("> (UI Reducer Action) " + action.type);

  switch (action.type) {
    case "CATEGORY_SELECTED":
      return {
        ...state,
        selectedCategory:
          // Change category if is different than current, else set to no selected category
          state.selectedCategory?.id !== action.category.id
            ? action.category
            : null,
      };

    case "ADD_ITEM_STARTED": {
      return {
        ...state,
        inputMode: InputMode.ADD,
      };
    }
    case "EDIT_ITEM_STARTED": {
      return {
        ...state,
        editItem: action.item, // XXX: Måske blot text?? Således samme ved nyt item.
        selectedCategory: action.item.category,
        inputMode: InputMode.EDIT,
      };
    }
    case "ADD_ITEM_ENDED":
    case "EDIT_ITEM_ENDED": {
      return {
        ...state,
        inputMode: InputMode.NONE,
        selectedCategory: null,
        editItem: null,
      };
    }
  }
}

// PROVIDER
export default function ShoppingListUIContextProvider({ children }: Props) {
  const [state, dispatch] = useReducer(shoppingListUiContextReducer, {
    inputMode: InputMode.NONE,
    selectedCategory: null,
    editItem: null,
  });

  const { addItemEventFiredOnScreen, acknowledgeAddItemEvent } =
    useNavigationContext();

  useEffect(() => {
    if (addItemEventFiredOnScreen === "ShoppingListScreen") {
      console.log("setting input mode: " + addItemEventFiredOnScreen);
      dispatch({ type: "ADD_ITEM_STARTED" });
      acknowledgeAddItemEvent();
    }
  }, [addItemEventFiredOnScreen]);

  return (
    <ShoppingListUIContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ShoppingListUIContext.Provider>
  );
}
