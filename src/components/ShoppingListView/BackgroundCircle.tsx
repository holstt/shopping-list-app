import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../../config/colors";

// Hides the button
export default function BackgroundCircle() {
  return (
    <View style={styles.container}>
      <View style={styles.plusButton}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // height: "100%",
    // backgroundColor: "red",
    // flex: 1,
    // bottom: 0,
    // backgroundColor: "tra",
    elevation: 1000,
    position: "absolute",
    right: 146, // TODO: Make it dynamic :)
    bottom: -20,
  },
  plusButton: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: colors.backgroundBlue,
    // backgroundColor: 'transparent'
    // height: "100%",
    // width: "100%",
    // borderWidth: 3,
    // borderColor: "white",

    // position: "absolute",

    // bottom: 0,
    // zIndex: 99,
    // elevation: -1,
    // right: 0,
    // margin: 6,
  },
});
