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
    gap: 16,
  }
});
