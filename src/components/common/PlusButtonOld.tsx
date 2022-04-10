import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../../config/colors";

interface Props {
  onPress: () => void;
  testID?: string;
}

// Deprecated :)
export default function PlusButtonOld({ onPress }: Props) {
  return (
    <TouchableOpacity
      testID="add-item-button"
      style={styles.plusButton}
      onPress={onPress}
    >
      <Feather name="plus" size={33} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  plusButton: {
    // backgroundColor: "#2473E9",
    backgroundColor: colors.blue,
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,

    position: "absolute",
    bottom: 50,
    right: 0,
    margin: 6,
  },
});
