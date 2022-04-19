import { StyleSheet, View, ScrollView } from "react-native";
import Category from "../../models/Category";
import CategorySelectButton from "./CategorySelectButton";

interface Props {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
  isHidden: boolean;
}

export default function CategoryPicker({
  categories,
  onCategoryPress,
  isHidden,
}: Props) {
  isHidden = false; // XXX: Tag stilling til om nødvendigt
  return (
    // Do not blur if category buttons are clicked.
    <ScrollView keyboardShouldPersistTaps="always" horizontal={true}>
      <View
        style={[
          styles.categoryPickerContainer,
          isHidden && styles.categoryPickerContainerHidden,
        ]}
      >
        {categories.map((cat) => (
          <CategorySelectButton
            isDisabled={isHidden}
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
    // backgroundColor: "red",
    backgroundColor: "white",

    flexDirection: "row",
    paddingBottom: 10,
    paddingLeft: 10,
    // marginTop: 10,
  },
  categoryPickerContainerHidden: {
    // opacity: 0.1,
    backgroundColor: "transparent",

    opacity: 0,
  },
});
