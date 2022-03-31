import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  TouchableOpacity,
  ViewStyle,
  Animated,
  GestureResponderEvent,
} from "react-native";
import Colors from "../../config/colors";

export enum CountType {
  INCREMENT,
  DECREMENT,
}

interface Props {
  onPress: (id: string, countType: CountType) => void;
  id: string;
}

export default function Counter({ onPress, id }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onPress(id, CountType.INCREMENT)}
      >
        <Text style={styles.iconText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onPress(id, CountType.DECREMENT)}
      >
        <Text style={styles.iconText}>-</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 70,
    marginTop: 5, // XXX: Lav container med de andre
    marginBottom: 5,
    alignItems: "center",
    // marginLeft: "auto",
    // backgroundColor: "blue",
  },
  iconText: {
    fontSize: 20,

    textAlign: "center",
    textAlignVertical: "center",
    color: "#5D6D7E",
    margin: 0,
    padding: 0,
    // backgroundColor: "blue",
    includeFontPadding: false,
  },
  button: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#5D6D7E",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
});
