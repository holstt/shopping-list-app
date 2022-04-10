import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../../config/colors";

interface Props {
  onPress: () => void;
  testID?: string;
}

export default function PlusButtonNew({ onPress }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="add-item-button"
        style={styles.plusButton}
        onPress={onPress}
      >
        <Feather name="plus" size={33} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // height: "100%",
    width: 70,
    height: 70,
    // backgroundColor: "red",
    // flex: 1,
  },
  plusButton: {
    // backgroundColor: "#2473E9",
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    height: "100%",
    width: "100%",
    borderWidth: 3,
    borderColor: "white",
    // elevation: 3,

    // position: "absolute",
    bottom: 20,
    // bottom: 0,
    // zIndex: 1,
    // elevation: 1,
    // right: 0,
    // margin: 6,
  },
});
