// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import ShoppingItem from "./components/ShoppingItem";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.listHeader}>MyList</Text>

      <ScrollView>
        <ShoppingItem text="Item1"></ShoppingItem>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    margin: 10,
    marginTop: StatusBar.currentHeight,
    // textAlign: "left",
    // alignItems: "left",
    // justifyContent: "center",
  },
  listHeader: {
    // flex: 1,
    backgroundColor: "#fff",
    textAlign: "left",
    fontSize: 40,
    marginBottom: 10,
    // marginLeft: 5,
    // alignItems: "left",
    // justifyContent: "center",
  },
});
