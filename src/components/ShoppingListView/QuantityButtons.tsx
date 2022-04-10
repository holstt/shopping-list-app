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
import { FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";
import colors from "../../config/colors";

export enum CountType {
  INCREMENT,
  DECREMENT,
}

interface Props {
  onPress: (id: string, countType: CountType) => void; // XXX: Eller en til begge?
  id: string;
  isDecrementButtonEnabled: boolean;
}

export default function QuantityButtons({
  onPress,
  id,
  isDecrementButtonEnabled,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onPress(id, CountType.INCREMENT)}
      >
        <AntDesign name="pluscircle" style={styles.logo} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onPress(id, CountType.DECREMENT)}
        // disabled={!isDecrementButtonEnabled} // XXX: Trigger item button hvis disabled. Fix
      >
        <AntDesign
          name="minuscircle"
          style={[
            styles.logo,
            !isDecrementButtonEnabled ? styles.logoDisabled : null,
          ]}
        />
      </TouchableOpacity>

      {/*       
      <TouchableOpacity
        style={styles.button}
        onPress={() => onPress(id, CountType.INCREMENT)}
      >
        <Text style={styles.iconText}>+</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => onPress(id, CountType.DECREMENT)}
      >
        <Text style={styles.iconText}>-</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "blue",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 70,
    alignItems: "center",
    // zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 20,
  },
  // iconText: {
  //   fontSize: 20,

  //   textAlign: "center",
  //   textAlignVertical: "center",
  //   color: "#5D6D7E",
  //   margin: 0,
  //   padding: 0,
  //   // backgroundColor: "blue",
  //   includeFontPadding: false,
  // },
  button: {
    zIndex: 1,
    // Shadow
    shadowColor: "black",
    // shadowOffset: {
    //   width: 2,
    //   height: 20,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.5,
    // borderRadius: 100,
    // elevation: 3,
    // backgroundColor: "white",
  },
  logo: {
    fontSize: 30,
    color: colors.blue,
    elevation: 20,
  },
  logoDisabled: {
    // color: colors.lightGreyDisabled,
    // color: "#78AEE6",
    color: "#B8D4F2",
    // color: colors.blue,
  },
});
