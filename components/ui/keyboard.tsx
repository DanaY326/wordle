import { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export const keyboardkeys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'DELETE'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
];

export function Keyboard({
    coloredKeys,
    setPressedKey
} : {
    coloredKeys: string[],
    setPressedKey: (input: string) => void
}) {
    const textColor = useThemeColor({}, 'text');
    const getFlatIdx = (i: number, j: number) => {
        let result = 0;
        for (let k = 0; k < i; ++k) {
            result += keyboardkeys[k].length;
        }
        return result + j;
    }
    return (
        <View style={styles.container}>
            {keyboardkeys.map((row, i) => {
            return (
                <View style={styles.keyboardRow} key={row[0]}>
                    {row.map((key, j) => {
                        return (
                            <Pressable 
                                key={j} 
                                onPress={() => {
                                    setPressedKey(key);
                                }}
                            >
                                <View style={[styles.key, {
                                        backgroundColor: coloredKeys[getFlatIdx(i, j)]}]}>
                                    <Text style={{color: textColor}}>{key}
                                    </Text>
                                </View>
                            </Pressable>
                        )
                    })}
                </View>
            )
        })}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        gap: 10
    },
    keyboardRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    key: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'gray',
        borderStyle: 'solid',
        borderWidth: 1,
        minWidth: 25,
        height: 60,
        marginHorizontal: 5,
        paddingHorizontal: 2
    }
})