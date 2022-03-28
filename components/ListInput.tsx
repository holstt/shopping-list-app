import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Category from "../models/Category";
import CategoryPicker from "./Category/CategoryPicker";

interface Props {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
  showCategory: Category | null;
  inputComponent: ReactElement<TextInput>;
}

export default function ListInput({
  categories,
  onCategoryPress,
  showCategory,
  inputComponent,
}: Props) {
  return (
    <View>
      <View style={styles.inputContainer}>
        {inputComponent}
        {showCategory && ( // XXX: Component?
          <View
            style={[
              styles.categoryColorRectangle,
              { backgroundColor: showCategory.color },
            ]}
          ></View>
        )}
      </View>
      <CategoryPicker
        categories={categories}
        onCategoryPress={onCategoryPress}
      ></CategoryPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryColorRectangle: {
    // backgroundColor: "blue",
    marginLeft: "auto",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 13,
    marginTop: 7,
    marginBottom: 7,
  },
  inputContainer: {
    flexDirection: "row",
  },
});
