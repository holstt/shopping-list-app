import ShoppingItem from "../../models/ShoppingItem";
import ShoppingList from "../../models/ShoppingList";

export enum ActionKind {
  ADD_ITEM = "ADD_ITEM",
  REMOVE_ITEM = "REMOVE_ITEM",
  UPDATE_ITEM = "UPDATE_ITEM",

  GO_TO_NEXT_LIST = "GO_TO_NEXT_LIST",
  GO_TO_PREV_LIST = "GO_TO_PREV_LIST",

  ADD_LIST = "ADD_LIST",
  REMOVE_LIST = "REMOVE_LIST",
  UPDATE_LIST = "UPDATE_LIST",
}

interface Payload {
  inputItem: ShoppingItem;
  inputList: ShoppingList;
}

export interface Action {
  type: ActionKind;
  payload: Partial<Payload>;
}

export interface State {
  allLists: ShoppingList[];
  currentListIndex: number;
}

export default function shoppingListReducer(
  state: State,
  { type, payload }: Action
): State {
  console.log("> (Reducer Action) " + type);
  switch (type) {
    case ActionKind.ADD_ITEM: {
      if (!payload.inputItem) throw new Error("Expected payload");
      const currentList = state.allLists[state.currentListIndex];
      const currentListUpdate = {
        ...currentList,
        items: [...currentList.items, payload.inputItem],
      };

      return {
        ...state,
        allLists: state.allLists.map((list) =>
          list.id === currentList.id ? currentListUpdate : list
        ),
      };
    }

    case ActionKind.REMOVE_ITEM: {
      if (!payload.inputItem) throw new Error("Expected payload");

      const currentList = state.allLists[state.currentListIndex];

      const currentListUpdate = {
        ...currentList,
        items: currentList.items.filter(
          (item) => item.id !== payload.inputItem?.id
        ),
      };
      return {
        ...state,
        allLists: state.allLists.map((list) =>
          list.id === currentList.id ? currentListUpdate : list
        ),
      };
    }

    case ActionKind.UPDATE_ITEM: {
      if (!payload.inputItem) throw new Error("Expected payload");
      const currentList = state.allLists[state.currentListIndex];

      const currentListUpdate = {
        ...currentList,
        items: currentList.items.map((item) =>
          item.id === payload.inputItem?.id ? payload.inputItem : item
        ),
      };
      return {
        ...state,
        allLists: state.allLists.map((list) =>
          list.id === currentList.id ? currentListUpdate : list
        ),
      };
    }

    case ActionKind.GO_TO_PREV_LIST: {
      // Ensure has prev list.
      const newIndex = state.currentListIndex - 1;
      return {
        ...state,
        currentListIndex: newIndex >= 0 ? newIndex : state.currentListIndex,
      };
    }

    case ActionKind.GO_TO_NEXT_LIST: {
      // Ensure has next list.
      const newIndex = state.currentListIndex + 1;
      return {
        ...state,
        currentListIndex:
          newIndex < state.allLists.length ? newIndex : state.currentListIndex,
      };
    }

    case ActionKind.ADD_LIST:
      if (!payload.inputList) throw new Error("Expected payload");
      return {
        ...state,
        allLists: [...state.allLists, payload.inputList],
      };

    case ActionKind.REMOVE_LIST:
      if (!payload.inputList) throw new Error("Expected payload");
      return {
        ...state,
        currentListIndex: 0, // Reset list index
        allLists: state.allLists.filter(
          (list) => list.id !== payload.inputList?.id
        ),
      };

    case ActionKind.UPDATE_LIST:
      if (!payload.inputList) throw new Error("Expected payload");
      return {
        ...state,
        allLists: state.allLists.map((list) =>
          list.id === payload.inputList?.id ? payload.inputList : list
        ),
      };

    default:
      throw new Error("(Reducer error) No such type: " + type);
  }
}
