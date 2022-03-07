import { StyleSheet, View, StatusBar } from "react-native";
import ShoppingList from "./components/ShoppingList";

export default function App() {
  return (
    <View style={styles.container}>
      <ShoppingList></ShoppingList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginTop: StatusBar.currentHeight,
  },
});
