import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import colors from "../Colors";
import { FontAwesome } from "@expo/vector-icons";

interface Props {
  onButtonDown(event: GestureResponderEvent): void;
  onButtonUp(event: GestureResponderEvent): void;
  hasNextList: boolean;
  hasPrevList: boolean;
}

export default function UpDownButton({
  onButtonUp,
  onButtonDown,
  hasPrevList,
  hasNextList,
}: Props) {
  return (
    <View style={styles.upDownButtonContainer}>
      <TouchableOpacity onPress={onButtonUp} disabled={!hasPrevList}>
        <FontAwesome
          name="chevron-up"
          style={[styles.logo, !hasPrevList ? styles.logoDisabled : null]}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onButtonDown} disabled={!hasNextList}>
        <FontAwesome
          name="chevron-down"
          style={[styles.logo, !hasNextList ? styles.logoDisabled : null]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  upDownButtonContainer: {
    marginLeft: "auto",
  },
  logo: {
    fontSize: 26,
    color: colors.lightGrey,
  },
  logoDisabled: {
    color: colors.lightGreyDisabled,
  },
});
