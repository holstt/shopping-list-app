import uuid from "react-native-uuid";

export default class Item {
  id: number[] | string;
  title: string;
  isChecked: boolean;

  constructor(title: string, isChecked: boolean) {
    this.id = uuid.v4();
    this.title = title;
    this.isChecked = isChecked;
  }
}
