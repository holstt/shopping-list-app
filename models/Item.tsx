export default class Item {
  title: string;
  isChecked: boolean;

  constructor(title: string, isChecked: boolean) {
    this.title = title;
    this.isChecked = isChecked;
  }
}
