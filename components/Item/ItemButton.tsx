import { StyleSheet, View, TouchableOpacity } from "react-native";

import { FontAwesome } from "@expo/vector-icons";

interface ButtonProps {
  isChecked: boolean;
  onPress(): void;
}

export default function ItemButton({ isChecked, onPress }: ButtonProps) {
  const buttonUnchecked = (
    <TouchableOpacity style={styles.buttonDefault} onPress={onPress} />
  );

  const buttonChecked = (
    <TouchableOpacity onPress={onPress}>
      <FontAwesome
        name="check-circle"
        size={29} // XXX: Dynamisk?
        color="#2d7ffa"
      />
    </TouchableOpacity>
  );
  const itemButton = isChecked ? buttonChecked : buttonUnchecked;

  return <View style={styles.buttonContainer}>{itemButton}</View>;
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 29,
    height: 29,
    // Center icon inside
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },
  buttonDefault: {
    borderColor: "#2d7ffa",
    borderWidth: 3,
    // Fill container
    width: "90%",
    height: "90%",
    borderRadius: 99,
  },
});
