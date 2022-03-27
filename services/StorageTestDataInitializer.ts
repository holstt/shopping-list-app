import Category from "../models/Category";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListItem from "../models/ListItem";
import StorageService from "./StorageService";
import ChecklistView from "../components/Checklist/ChecklistView";
import ItemList from "../models/ItemList";
import AppData from "../AppData";
import LibraryItem from "../models/LibraryItem";

export default class StorageTestDataInitializer {
  public static async seedTestData() {
    // Don't seed test data if storage already contains data.
    if ((await AsyncStorage.getAllKeys()).length > 0) {
      return;
    }

    console.log("Seeding test data....");
    const testCategories = [
      new Category("Category1", "#EB7474", 0),
      new Category("Category2", "#1FDA6D", 1),
      new Category("Category3", "#1F76DA", 2),
      new Category("Fruit and Vegetables", "green", 3),
      new Category("Meat", "red", 4),
      new Category("Bread", "orange", 5),
      new Category("Bread", "orange", 6),
    ];

    const testColors = [
      "#C9F1C6",
      "#C4D5FE",
      "#FFFEE3",
      "#C9F4FE",
      "#FED3F1",
      "#FFB3C8",
      "#EB7474",
      "#FC6C85",
      "#1FDA6D",
      "#1F76DA",
      "#CC99FF",
    ];

    // Default library of items
    const testLibraryItems = [
      new LibraryItem("LibItem1", testCategories[0]),
      new LibraryItem("LibItem2", testCategories[1]),
      new LibraryItem("LibItem3", testCategories[2]),
      new LibraryItem("LibItem4", testCategories[3]),
      new LibraryItem("LibItem5", testCategories[4]),
    ];
    await StorageService.saveLibraryItems(testLibraryItems);

    const testItems = [
      ListItem.fromNonLibraryItem("Item1", testCategories[0]),
      ListItem.fromNonLibraryItem("Item2", testCategories[1]),
      ListItem.fromNonLibraryItem("Item3"),
    ];

    const testItems2 = [
      ListItem.fromNonLibraryItem("Item11", testCategories[0]),
      ListItem.fromNonLibraryItem("Item22", testCategories[2]),
      ListItem.fromNonLibraryItem("Item33", null),
    ];
    const itemLists = [
      new ItemList("My First List", testItems, 0),
      new ItemList("My Other List", testItems2, 1),
    ];

    const appData = new AppData(itemLists[0].id);
    await StorageService.saveAppData(appData);
    await StorageService.saveCategories(testCategories);
    await StorageService.saveItemLists(itemLists);
    console.log("Test data seeded!");
  }
}
