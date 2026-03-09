import { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TextInputKeyPressEvent, Text, Platform } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export function WordleInputRow({
    submitInput,
    pressedKey,
    setPressedKey
} : {
    submitInput: (input: string) => void;
    pressedKey: string;
    setPressedKey: (input: string) => void;
}) {
    const [openBox, setOpenBox] = useState(0);
    const [wordSoFar, setWordSoFar] = useState("");
    const [charList, setCharList] = useState(new Array(5).fill(' '));
    const textColor = useThemeColor({}, 'text');
    const onChangeText = (text: string) => {
        if (openBox >= 5) return;
        const uppercaseText = text.toUpperCase();
        setOpenBox(openBox + 1);
        setWordSoFar(wordSoFar + uppercaseText);
        const tempCharList = charList;
        tempCharList[openBox] = uppercaseText;
        setCharList(tempCharList);
    }
    const deleteChar = () => {
        if (openBox <= 0) return;
        if (openBox < 5) {
            const tempCharList = charList;
            tempCharList[openBox] = ' ';
            setCharList(tempCharList);
        }
        setOpenBox(openBox - 1);
        setWordSoFar(wordSoFar.substring(0, wordSoFar.length - 1));
    }
    const handleDelete = (e: TextInputKeyPressEvent) => {
        if (e.nativeEvent.key === 'Backspace' && openBox > 0) {
            deleteChar();
        }
    }
    useEffect(() => {
        if (pressedKey === 'DELETE') {
            setPressedKey('');
            deleteChar();
        } else if (pressedKey === 'ENTER') {
            setPressedKey('');
            submitInput(wordSoFar);
        } else if (pressedKey >= 'A' && pressedKey <= 'Z') {
            setPressedKey('');
            onChangeText(pressedKey);
        } 
    }, [pressedKey])
    return (
        <View style={styles.row}>
            {charList.map((letter, index) => {
                return (
                    <ThemedView style={
                            [styles.box, {backgroundColor: 'none'}]
                        } 
                        key={index}
                    >
                        {index === openBox ? 
                            <TextInput 
                                autoFocus={Platform.OS !== "ios" && Platform.OS !== "android"} 
                                style={{fontSize: 30, height: 30, width: 30}} 
                                onChangeText={onChangeText} 
                                onKeyPress={handleDelete}
                            /> :
                            <Text style={{fontSize: 30, height: 30, color: textColor}}>
                                {letter}
                            </Text>
                        }
                    </ThemedView>
                )
            })}
            {openBox === 5 && 
            <TextInput 
                key={5} 
                autoFocus={Platform.OS !== "ios" && Platform.OS !== "android"} 
                style={{fontSize: 30, height: 0, width: 0}} 
                onKeyPress={handleDelete} 
                onSubmitEditing={() => submitInput(wordSoFar)}
            />}
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