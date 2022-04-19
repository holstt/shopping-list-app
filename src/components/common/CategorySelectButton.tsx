import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Category from "../../models/Category";

interface Props {
  onPress: (category: Category) => void;
  category: Category;
  isDisabled: boolean;
}

export default function CategorySelectButton({
  onPress,
  category,
  isDisabled,
}: Props) {
  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[styles.button, { backgroundColor: category.color }]}
      onPress={() => onPress(category)}
    >
      <Text numberOfLines={2} style={[styles.categoryRectangleAndText]}>
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
    marginRight: 7, // XXX: Fix uneven ift. start button.
  },
  categoryRectangleAndText: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "bold",
    padding: 10,
    // paddingBottom: 1,
    // paddingTop: 1,
    fontSize: 14,
    textAlign: "center",
    textAlignVertical: "center",
    textShadowColor: "#555",
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: 1,
  },
});
