import Category from "../models/Category";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShoppingItem from "../models/ShoppingItem";
import StorageService from "./StorageService";
import ShoppingList from "../models/ShoppingList";
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
      new LibraryItem("LibItem1", 1, testCategories[0]),
      new LibraryItem("LibItem2", 2, testCategories[1]),
      new LibraryItem("LibItem3", 3, testCategories[2]),
      new LibraryItem("LibItem4", 4, testCategories[3]),
      new LibraryItem("LibItem5", 5, testCategories[4]),
    ];
    await StorageService.saveLibraryItems(testLibraryItems);

    const testItems = [
      ShoppingItem.fromNew("Item1", 0, testCategories[0]),
      ShoppingItem.fromNew("Item2", 1, testCategories[1]),
      ShoppingItem.fromNew("Item3", 2),
      // ListItem.fromLibraryItem(testLibraryItems[0]), // XXX: Test dette!
    ];

    const testItems2 = [
      ShoppingItem.fromNew("Item11", 0, testCategories[0]),
      ShoppingItem.fromNew("Item22", 1, testCategories[2]),
      ShoppingItem.fromNew("Item33", 2, null),
    ];
    const testShoppingLists = [
      new ShoppingList("ShoppingList1", testItems, 0),
      new ShoppingList("ShoppingList2", testItems2, 1),
    ];

    const appData = new AppData(testShoppingLists[0].id);
    await StorageService.saveAppData(appData);
    await StorageService.saveCategories(testCategories);
    await StorageService.saveItemLists(testShoppingLists);
    console.log("Test data seeded!");
  }
}
