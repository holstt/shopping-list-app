import Category from "../models/Category";
import Entity from "../models/Entity";
import Item from "../models/Item";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ITEM_STORE_KEY = "item";
const CATEGORY_STORE_KEY = "category";

// XXX: Lav StorageTestDataIntializer, GenericStorage/Storage, LocalStorage

export default class StorageService {
  public static async loadCategories(): Promise<Category[]> {
    return await this.loadMany<Category>(CATEGORY_STORE_KEY);
  }

  public static async loadItems(): Promise<Item[]> {
    return await this.loadMany<Item>(ITEM_STORE_KEY);
  }

  public static async saveItem(item: Item) {
    await this.save(ITEM_STORE_KEY, item.id, item);
  }

  public static async saveCategory(item: Item) {
    await this.save(ITEM_STORE_KEY, item.id, item);
  }

  public static async load<T>(store: string, id: string): Promise<T | null> {
    const json = await AsyncStorage.getItem(`${store}:${id}`);
    const item: T | null = json != null ? JSON.parse(json) : null;

    return item;
  }

  public static async loadMany<T>(storeKey: string): Promise<T[]> {
    const keys = (await AsyncStorage.getAllKeys()).filter((k) =>
      k.startsWith(storeKey)
    );
    const jsonObjects = await AsyncStorage.multiGet(keys);

    // // Remove objects with no value
    // const jsonObjectsWithValue: [string, string][] = jsonObjects.filter(
    //   (o): o is [string, string] => !!o[1]
    // );

    // Make array of items from parsing value
    const items: T[] = jsonObjects.map((o) => (o[1] ? JSON.parse(o[1]) : null));

    return items;
  }

  public static async saveMany<T extends Entity>(store: string, objects: T[]) {
    const makeKey = (id: string) => store + ":" + id;
    const keyValuePairs = objects.map((o) => [
      makeKey(o.id),
      JSON.stringify(o),
    ]);

    await AsyncStorage.multiSet(keyValuePairs);
  }

  // tslint:disable-next-line: no-any
  public static async save(store: string, id: string, object: any) {
    const key = store + ":" + id;
    const jsonValue = JSON.stringify(object);
    await AsyncStorage.setItem(key, jsonValue);

    console.log("Object saved: " + key);
  }

  public static async clearAllData() {
    await AsyncStorage.clear();
  }

  // XXX: Flyttes
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

    await this.saveMany(CATEGORY_STORE_KEY, testCategories);
    await this.saveMany(ITEM_STORE_KEY, testItems);
    console.log("Test data seeded!");
  }
}
