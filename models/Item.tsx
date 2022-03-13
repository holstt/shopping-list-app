import uuid from "react-native-uuid";

export default class Item {
  id: string;
  title: string;
  isChecked: boolean;
  category: Category | null;

  constructor(title: string, isChecked: boolean, category: Category | null) {
    this.id = uuid.v4().toString();
    this.title = title;
    this.isChecked = isChecked;
    this.category = category;
  }
}
