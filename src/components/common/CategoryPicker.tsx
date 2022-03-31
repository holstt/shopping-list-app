import { StyleSheet, View, ScrollView } from "react-native";
import Category from "../../models/Category";
import CategorySelectButton from "./CategorySelectButton";

interface Props {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
}

export default function CategoryPicker({ categories, onCategoryPress }: Props) {
  return (
    // Do not blur if category buttons are clicked.
    <ScrollView keyboardShouldPersistTaps="always" horizontal={true}>
      <View style={styles.categoryPickerContainer}>
        {categories.map((cat) => (
          <CategorySelectButton
            key={cat.id}
            onPress={onCategoryPress}
            category={cat}
          ></CategorySelectButton>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoryPickerContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 10,
  },
});
