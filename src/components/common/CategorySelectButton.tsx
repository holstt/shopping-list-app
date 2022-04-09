import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Category from "../../models/Category";

interface Props {
  onPress: (category: Category) => void;
  category: Category;
}

export default function CategorySelectButton({ onPress, category }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: category.color }]}
      onPress={() => onPress(category)}
    >
      <Text numberOfLines={2} style={[styles.categoryReactangle]}>
        {category.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 18,
    height: 60,
    width: 80,
    marginRight: 7,
  },
  categoryReactangle: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "bold",
    padding: 10,
    // paddingBottom: 1,
    // paddingTop: 1,
    fontSize: 14,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
