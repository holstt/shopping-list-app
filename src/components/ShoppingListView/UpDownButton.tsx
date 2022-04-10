import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import colors from "../../config/colors";
import { FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";

interface Props {
  onButtonDown(event: GestureResponderEvent): void;
  onButtonUp(event: GestureResponderEvent): void;
  isUpButtonEnabled: boolean;
  isDownButtonEnabled: boolean;
}

export default function UpDownButton({
  onButtonUp,
  onButtonDown,
  isUpButtonEnabled,
  isDownButtonEnabled,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onButtonUp} disabled={!isUpButtonEnabled}>
        {/* <Entypo
          name="chevron-up"
          style={[styles.logo, !isUpButtonEnabled ? styles.logoDisabled : null]}
        /> */}
        <AntDesign
          name="upcircle"
          style={[styles.logo, !isUpButtonEnabled ? styles.logoDisabled : null]}
        />
        {/* <FontAwesome
          name="chevron-up"
          style={[styles.logo, !isUpButtonEnabled ? styles.logoDisabled : null]}
        /> */}
      </TouchableOpacity>
      <TouchableOpacity onPress={onButtonDown} disabled={!isDownButtonEnabled}>
        <AntDesign
          name="downcircle"
          style={[
            styles.logo,
            !isDownButtonEnabled ? styles.logoDisabled : null,
          ]}
        />
        {/* <Entypo
          name="chevron-down"
          style={[styles.logo, !isUpButtonEnabled ? styles.logoDisabled : null]}
        /> */}
        {/* <FontAwesome
          name="chevron-down"
          style={[
            styles.logo,
            !isDownButtonEnabled ? styles.logoDisabled : null,
          ]}
        /> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "blue",
    marginLeft: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  logo: {
    fontSize: 32,
    color: "white",
  },
  logoDisabled: {
    // color: colors.lightGreyDisabled,
    color: "#3887DA",
    // color: colors.blue,
  },
});
