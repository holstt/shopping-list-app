import Category from "../../models/Category";
import ShoppingItem from "../../models/ShoppingItem";
import ShoppingList from "../../models/ShoppingList";
import { itemReducer, ItemReducerAction } from "./itemReducer";

export type ShoppingListReducerAction =
  | { type: "ITEM_ADDED"; item: ShoppingItem }
  | { type: "ITEM_REMOVED"; itemId: string }
  | { type: "MOVED_TO_NEXT_LIST" }
  | { type: "MOVED_TO_PREV_LIST" }
  | { type: "LIST_ADDED"; list: ShoppingList }
  | { type: "LIST_REMOVED"; listId: string }
  | { type: "LIST_TITLE_CHANGED"; listId: string; newTitle: string }
  | ItemReducerAction;

export interface ShoppingListReducerState {
  allLists: ShoppingList[];
  currentListIndex: number;
}

export default function shoppingListReducer(
  state: ShoppingListReducerState,
  action: ShoppingListReducerAction
): ShoppingListReducerState {
  console.log("> (Reducer Action) " + action.type);
  const currentList = state.allLists[state.currentListIndex];

  switch (action.type) {
    case "ITEM_ADDED": {
      return {
        ...state,
        allLists: state.allLists.map((list) =>
          list.id === currentList.id
            ? {
                ...currentList,
                items: [...currentList.items, action.item],
              }
            : list
        ),
      };
    }

    case "ITEM_REMOVED": {
      const currentListUpdate = {
        ...currentList,
        items: currentList.items.filter((item) => item.id !== action.itemId),
      };
      return {
        ...state,
        allLists: state.allLists.map((list) =>
          list.id === currentList.id ? currentListUpdate : list
        ),
      };
    }

    case "ITEM_CHECKED_TOGGLED":
    case "ITEM_CATEGORY_CHANGED":
    case "ITEM_QUANTITY_CHANGED":
    case "ITEM_TITLE_CHANGED": {
      const currentListUpdate = {
        ...currentList,
        items: currentList.items.map((item) =>
          item.id === action.id ? itemReducer(item, action) : item
        ),
      };
      return {
        ...state,
        allLists: state.allLists.map((list) =>
          list.id === currentList.id ? currentListUpdate : list
        ),
      };
    }

    case "MOVED_TO_PREV_LIST": {
      // Ensure has prev list.
      const newIndex = state.currentListIndex - 1;
      return {
        ...state,
        currentListIndex: newIndex >= 0 ? newIndex : state.currentListIndex,
      };
    }

    case "MOVED_TO_NEXT_LIST": {
      // Ensure has next list.
      const newIndex = state.currentListIndex + 1;
      return {
        ...state,
        currentListIndex:
          newIndex < state.allLists.length ? newIndex : state.currentListIndex,
      };
    }

    case "LIST_ADDED":
      return {
        ...state,
        allLists: [...state.allLists, action.list],
      };

    case "LIST_REMOVED":
      return {
        ...state,
        currentListIndex: 0, // Reset list index
        allLists: state.allLists.filter((list) => list.id !== action.listId),
      };

    case "LIST_TITLE_CHANGED":
      return {
        ...state,
        allLists: state.allLists.map((list) =>
          list.id === action.listId ? { ...list, title: action.newTitle } : list
        ),
      };

    // default:
    // throw new Error("(Reducer error) No such type: " + type);
  }
}
