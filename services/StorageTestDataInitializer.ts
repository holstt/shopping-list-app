import Category from "../models/Category";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Item from "../models/Item";
import StorageService from "./StorageService";
import ChecklistView from "../components/ChecklistView";
import ItemList from "../models/ItemList";
import AppData from "../AppData";

export default class StorageTestDataInitializer {
  public static async seedTestData() {
    // Don't seed test data if storage already contains data.
    if ((await AsyncStorage.getAllKeys()).length > 0) {
      return;
    }

    console.log("Seeding test data....");
    const testCategories = [
      new Category("Category1", "#EB7474"),
      new Category("Category2", "#1FDA6D"),
      new Category("Category3", "#1F76DA"),
      new Category("Fruit and Vegetables", "green"),
      new Category("Meat", "red"),
      new Category("Bread", "orange"),
      new Category("Bread", "orange"),
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
    const library = [
      new Item("LibItem1", false, testCategories[0]),
      new Item("LibItem2", true, testCategories[1]),
      new Item("LibItem3", false, testCategories[2]),
    ];

    const testItems = [
      new Item("Item1", false, testCategories[0]),
      new Item("Item2", true, testCategories[1]),
      new Item("Item3", false, null),
    ];

    const testItems2 = [
      new Item("Item11", false, testCategories[0]),
      new Item("Item22", true, testCategories[2]),
      new Item("Item33", true, null),
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
