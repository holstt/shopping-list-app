import { ReactElement } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Category from "../../models/Category";
import CategoryPicker from "./CategoryPicker";
import CustomAutocomplete from "../ShoppingListView/MyAutocompleter";

interface Props {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
  categoryToDisplay: Category | null;
  inputComponent: ReactElement<TextInput>;
}

export default function ListInput({
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
