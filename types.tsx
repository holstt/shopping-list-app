import Category from "./models/Category";
import ListItem from "./models/ListItem";
import ItemList from "./models/ItemList";
import LibraryItem from "./models/LibraryItem";

export type RootStackParamList = {
  ChecklistScreen: {}; // XXX: Skal komme fra context
  ListLibraryScreen: {};
  // ItemLibraryScreen: { initItems: LibraryItem[]; initCategories: Category[] };
  ItemLibraryScreen: {};
  CategoryLibraryScreen: {}; // XXX: Skal komme fra context
};
