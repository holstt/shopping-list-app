import { ReactElement } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Category from "../../models/Category";
import CategoryPicker from "./CategoryPicker";
import Autocomplete from "../ShoppingListView/Autocomplete";

interface Props {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
  categoryToDisplay: Category | null;
  inputComponent: ReactElement<TextInput>;
}

export default function ItemInput({
  categories,
  onCategoryPress,
  categoryToDisplay,
  inputComponent,
}: Props) {
  return (
    <View>
      <View style={styles.inputContainer}>
        <View>{inputComponent}</View>
        {categoryToDisplay && ( // XXX: Component?
          <View
            style={[
              styles.categoryColorRectangle,
              { backgroundColor: categoryToDisplay.color },
            ]}
          ></View>
        )}
      </View>
      <CategoryPicker
        isHidden={false}
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
    // backgroundColor: "blue",
    flexDirection: "row",
  },
});
