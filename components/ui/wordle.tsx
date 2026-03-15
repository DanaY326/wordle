import { useState, useRef, useEffect } from 'react';
import { View, Button, Modal, Alert, StyleSheet, Text, Platform } from 'react-native';
import { WordleRow } from '@/components/ui/wordle-row';
import { WordleInputRow } from './wordle-row-input';
import { Keyboard, keyboardkeys } from './keyboard';
import { generate } from 'random-words';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export function Wordle() {
    const possibleRandomWords = [
        "WATER",
        "APPLE",
        "CARTS",
        "GUMMY"
    ];
    const NUM_ROWS = 6;

    const [rows, setRows] = useState(new Array(NUM_ROWS).fill(""));
    const [inputRow, setInputRow] = useState(0);
    const [gameStatus, setGameStatus] = useState('');
    const [pressedKey, setPressedKey] = useState('');
    const blankColoredKeys = keyboardkeys[0].concat(keyboardkeys[1].concat(keyboardkeys[2]));
    const coloredKeys = useRef(new Array(blankColoredKeys.length).fill(''));
    const [flipper, setFlipper] = useState(0);

    const secretWord = generate({ minLength: 5, maxLength: 5});
    const secretWordRef = useRef(
        typeof secretWord === 'string' && secretWord.length === 5 ? 
        secretWord.toUpperCase() : 
        possibleRandomWords[Math.floor(Math.random() * possibleRandomWords.length)] 
    );
    const [charList, setCharList] = useState(secretWordRef.current.split(""));
    const openModal = (message: string) => {
        setTimeout(() => {
            setGameStatus(message);
        }, 200)
    }

    const handleGuess = async (guess: string) => {
        if (guess.length === 5) {
            // console.log(secretWordRef.current);
            try { 
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`);
                const json = await response.json();
                if (!(json[0] !== undefined && 'word' in json[0])) {
                    Alert.alert(guess + ' is not a valid word');
                    return;
                }
            } catch(e) {
                console.error("Error checking if English word: " + e);
            }
            const rowsTemp = rows;
            rowsTemp[inputRow] = guess;
            setRows(rowsTemp);
            setInputRow(inputRow + 1);
            guess.split("").forEach((letter, index) => {
                if (letter === charList[index]) {
                    const idx = blankColoredKeys.findIndex((key) => letter === key);
                    coloredKeys.current[idx] = 'green';
                } else if (charList.includes(letter)) {
                    const idx = blankColoredKeys.findIndex((key) => letter === key);
                    if (coloredKeys.current[idx] != 'green') {
                        coloredKeys.current[idx] = 'goldenrod';
                    }
                } else {
                    const idx = blankColoredKeys.findIndex((key) => letter === key);
                    if (coloredKeys.current[idx] != 'green' && coloredKeys.current[idx] != 'goldenrod') {
                        coloredKeys.current[idx] = 'gray';
                    }
                }
            })
            setFlipper(1 - flipper);
            if (guess === secretWordRef.current) {
                openModal('You won!');
            } else if (rowsTemp[NUM_ROWS - 1]) {
                openModal('Game over!');
            }
        }
    }

    const reset = () => {
        const secretWordNew = generate({ minLength: 5, maxLength: 5});
        secretWordRef.current = typeof secretWordNew === 'string' && secretWordNew.length === 5 ?
            secretWordNew.toUpperCase() : 
            possibleRandomWords[Math.floor(Math.random() * possibleRandomWords.length)];
        setCharList(secretWordRef.current.split(""));
        setRows([]);
        setRows(new Array(NUM_ROWS).fill(""));
        setInputRow(0);
        coloredKeys.current = new Array(blankColoredKeys.length).fill('');
    }

    const getWordVal = (word: string) => {
        let val = 0;
        let multiplier = 1;
        const aCharCode = 'A'.charCodeAt(0);
        for (let i = word.length - 1; i >= 0; --i) {
            val += (word[i].charCodeAt(0) - aCharCode) * multiplier;
            multiplier *= 10;
        }
        return val;
    }

    return (
        <View style={styles.container} key={getWordVal(secretWordRef.current)}>
            <Modal transparent={true} visible={!!gameStatus} animationType='slide'>
                <ThemedView style={styles.gameOverScreen}>
                    <ThemedText>{gameStatus}</ThemedText>
                    <ThemedText>Word: {secretWordRef.current}</ThemedText>
                    <Button title={"Play again"} onPress={() => {setGameStatus(''); reset()}}/>
                </ThemedView>
            </Modal>
            <View style={styles.grid}>
                <Button title={"Reset"} onPress={reset}/>
                <Text style={{height: 5}}>{"\n"}</Text>
                {rows.map((word, index) => {
                    return (
                        index === inputRow ?
                        <WordleInputRow submitInput={handleGuess} key={index} pressedKey={pressedKey} setPressedKey={setPressedKey}/> :
                        <WordleRow input={word} secretWordChars={charList} key={index}/>
                    )
                })}
            </View>
            <Keyboard key={flipper} setPressedKey={setPressedKey} coloredKeys={coloredKeys.current}/>
        </View>
    )
}

const styles = StyleSheet.create({
    gameOverScreen: {
        marginTop: 50, 
        padding: 30, 
        flex: 1
    }, 
    container: {
        gap: 30,
        marginTop: (Platform.OS === "ios" || Platform.OS === "android") ? 50 : 0,
    }, 
    grid: {
        gap: 10,
        alignItems: "center",
    }
})