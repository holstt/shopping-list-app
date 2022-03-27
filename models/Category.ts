import uuid from "react-native-uuid";

export default class Category {
  id: string;
  title: string;
  color: string;
  // Order relative to other categories.
  index: number;

  constructor(title: string, color: string, index: number) {
    this.id = uuid.v4().toString();
    this.title = title;
    this.color = color;
    this.index = index;
  }
}
