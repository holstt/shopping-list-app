import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  useContext,
} from "react";
import ShoppingList from "../models/ShoppingList";
import { Action, State } from "./reducers/shoppingListsReducer";

interface ShoppingListState {
  state: State;
  dispatch: Dispatch<Action>;
}
// Give initial empty values to avoid not null. // XXX: Fix senere med library
export const ShoppingListsContext = createContext<
  ShoppingListState | undefined
>(undefined);

export function useShoppingListsContext() {
  const context = useContext(ShoppingListsContext);

  if (!context) {
    throw new Error("Context was not wrapped in a provider");
  }
  return context;
}
