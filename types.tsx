import Category from "./models/Category";
import Item from "./models/Item";
import ItemList from "./models/ItemList";

export type RootStackParamList = {
  ChecklistScreen: { initItemLists: ItemList[]; initCategories: Category[] }; // XXX: Skal komme fra context
  ListLibraryScreen: { initItemLists: ItemList[] };
  ItemLibraryScreen: { items: Item[] };
  CategoryLibraryScreen: { categories: Category[] }; // XXX: Skal komme fra context
};
