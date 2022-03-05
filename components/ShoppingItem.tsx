import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";

interface Props {
  text: string;
}

export default function ShoppingItem({ text }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonDefault} />
      <Text style={styles.item}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // borderStyle: "dotted",
    borderTopColor: "grey",
    borderBottomColor: "grey",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    borderWidth: 1,
    // alignItems: "center",
  },
  buttonDefault: {
    // backgroundColor: "#2D31FA",
    borderColor: "#2D31FA",
    borderWidth: 3,
    width: 26,
    height: 26,
    borderRadius: 99,
    marginRight: 5,
  },
  item: {
    // flex: 1,
    backgroundColor: "#fff",
    fontSize: 20,

    // margin: 5,
    // textAlign: "left",
    // alignItems: "left",
  },
});
