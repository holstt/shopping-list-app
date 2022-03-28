import Category from "./models/Category";
import ListItem from "./models/ListItem";
import ItemList from "./models/ItemList";
import LibraryItem from "./models/LibraryItem";

export type RootStackParamList = {
  ChecklistScreen: { initItemLists: ItemList[]; initCategories: Category[] }; // XXX: Skal komme fra context
  ListLibraryScreen: { initItemLists: ItemList[] };
  // ItemLibraryScreen: { initItems: LibraryItem[]; initCategories: Category[] };
  ItemLibraryScreen: { initCategories: Category[] };
  CategoryLibraryScreen: { categories: Category[] }; // XXX: Skal komme fra context
};
