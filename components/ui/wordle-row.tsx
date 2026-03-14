import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/themed-view';

export function WordleRow({
    input,
    secretWordChars,
} : {
    input: string;
    secretWordChars: string[];
}) {

    const [charList, setCharList] = useState(input.split(""));
    useEffect(() => {
        if (charList.length !== 5) {
            setCharList(new Array(5).fill(' '));
        }
    }, []);
    return (
        <View style={styles.row}>
            {charList.map((letter, index) => {
                return (
                    <ThemedView style={
                            [styles.box, 
                            {
                                backgroundColor: 
                                    letter === ' ' ? 'none' :
                                    letter == secretWordChars[index] ? 'green' : 
                                    secretWordChars.includes(letter) ? 'goldenrod' : 
                                    'gray'
                            }]
                        } 
                        key={index}
                    >
                        <Text style={{fontSize: 30, color: 'white'}}>{letter}</Text>
                    </ThemedView>
                )
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        borderColor: 'gray',
        borderStyle: 'solid',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
    },
    row: {
        flexDirection: "row",
        gap: 10,
    }
})