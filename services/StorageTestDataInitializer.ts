import Category from "../models/Category";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Item from "../models/Item";
import StorageService from "./StorageService";
import ListView from "../components/ListView";
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

    // XXX: Ensure singleton?
    const appData = new AppData(itemLists[0].id);
    await StorageService.saveAppData(appData);
    await StorageService.saveCategories(testCategories);
    await StorageService.saveItemLists(itemLists);
    console.log("Test data seeded!");
  }
}
