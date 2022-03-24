import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface Props {
  onPress: () => void;
}

export default function PlusButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.plusButton} onPress={onPress}>
      <Feather name="plus" size={33} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  plusButton: {
    backgroundColor: "#2473E9",
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 6,
  },
});
