import Category from "../models/Category";
import Entity from "../models/Entity";
import Item from "../models/Item";
import AsyncStorage from "@react-native-async-storage/async-storage";

// XXX: Bør opdeles i test seeder og generic storage service
const ITEM_KEY = "items";
const CATEGORIES_KEY = "items";

export default class StorageService {
  public static async loadItems() {
    return this.loadData(ITEM_KEY);
  }

  public static async loadCategories() {
    return this.loadData(CATEGORIES_KEY);
  }

  public static async loadData(key: string) {
    // try {
    const jsonValue = await AsyncStorage.getItem(key);
    const object = jsonValue != null ? JSON.parse(jsonValue) : null;
    // } catch(e) {
    //   // read error
    // }

    console.log("Object loaded: " + key);
    return object;
  }

  // tslint:disable-next-line: no-any
  public static async storeObject(key: string, object: any) {
    // try {
    const jsonValue = JSON.stringify(object);
    await AsyncStorage.setItem(key, jsonValue);
    // } catch(e) {
    //   // save error
    // }

    console.log("Object saved: " + key);
  }

  public static async seedTestData() {
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

    await this.storeObject("categories", testCategories);
    await this.storeObject("items", testItems);
    console.log("Test data seeded!");
  }

  public static async storeMany<T extends [[string, [any]]]>(objects: T) {
    try {
      console.log("Storing objects: " + objects.length);
      const jsonValues = objects.map((o) => [o[0], JSON.stringify(o[1])]);
      await AsyncStorage.multiSet(jsonValues);
    } catch (e) {
      // XXX: Vis popup til user! Men ikke her
      console.log(
        "An error occured while saving objects with keys: " +
          objects.map((o) => o[0])
      );
      console.log(e);
    }
  }
}
