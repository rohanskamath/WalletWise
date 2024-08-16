import {
  useFonts,
  Merriweather_400Regular,
  Merriweather_700Bold,
  Merriweather_900Black,
} from "@expo-google-fonts/merriweather";

export function useCustomFonts() {
  return useFonts({
    "merriweather-regular": Merriweather_400Regular,
    "merriweather-bold": Merriweather_700Bold,
    "merriweather-black": Merriweather_900Black,
  });
}
