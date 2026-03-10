import { StyleSheet, View } from 'react-native';
import { Wordle } from '@/components/ui/wordle';

export default function HomeScreen() {
  return (
    <View style={styles.mainContainer}>
      <Wordle/>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    overflow: 'hidden',
    padding: 32,
    marginTop: 50,
    gap: 16,
  },
  titleContainer: {
    backgroundColor: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
