// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import ShoppingItem from "./ShoppingItem";

export default function ShoppingList() {
  const testItems = ["Item1", "Item2", "Item3"];

  const items = testItems.map((item, i) => {
    if (i == testItems.length - 1) {
      return <ShoppingItem text={item} isLastElement={true}></ShoppingItem>;
    }
    return <ShoppingItem text={item}></ShoppingItem>;
  });

  return (
    <View>
      <Text style={styles.listHeader}>MyList</Text>
      <ScrollView>{items}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    // margin: 10,
    // marginTop: StatusBar.currentHeight,
    // textAlign: "left",
    // alignItems: "left",
    // justifyContent: "center",
  },
  listHeader: {
    // flex: 1,
    color: "#454a52",
    backgroundColor: "#fff",
    textAlign: "left",
    fontSize: 40,
    marginBottom: 10,
    // marginLeft: 5,
    // alignItems: "left",
    // justifyContent: "center",
  },
});
