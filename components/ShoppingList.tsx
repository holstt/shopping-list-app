// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import ShoppingItem from "./ShoppingItem";

export default function ShoppingList() {
  const testItems = ["Item1", "Item2", "Item3"]; // XXX: SKal komme fra props, indlæs fra local storage..

  // Create items.
  const items = testItems.map((item, i) => {
    return (
      <ShoppingItem
        text={item}
        isLastElement={i == testItems.length - 1}
      ></ShoppingItem>
    );
  });

  return (
    <View>
      <Text style={styles.listHeader}>MyList</Text>
      <ScrollView>{items}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  listHeader: {
    color: "#454a52",
    backgroundColor: "#fff",
    textAlign: "left",
    fontSize: 40,
    marginBottom: 10,
  },
});
