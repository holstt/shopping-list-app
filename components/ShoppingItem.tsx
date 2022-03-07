import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface Props {
  text: string;
  isLastElement?: boolean;
}

export default function ShoppingItem({ text, isLastElement }: Props) {
  return (
    <View
      style={[
        styles.itemContainer,
        isLastElement ? styles.itemContainerLast : styles.itemContainerRegular,
      ]}
    >
      <TouchableOpacity style={[styles.buttonDefault]} />
      <Text style={styles.item}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add a bottom border to the last item in the list
  itemContainerLast: {
    borderBottomColor: "#d5d8e3",
    // backgroundColor: "blue",
  },
  itemContainerRegular: {
    // backgroundColor: "purple",
    borderBottomColor: "transparent",
  },

  itemContainer: {
    flexDirection: "row",
    borderTopColor: "#d5d8e3",
    // flex: 1,
    // height: 100,
    alignItems: "center",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 5,
    borderWidth: 1,
  },
  buttonDefault: {
    // backgroundColor: "#2d7ffa",
    borderColor: "#2d7ffa",
    borderWidth: 3,
    width: 26,
    height: 26,
    borderRadius: 99,
    marginRight: 5,
  },
  item: {
    // flex: 1,
    backgroundColor: "#fff",
    color: "#454a52",
    fontSize: 20,
  },
});
