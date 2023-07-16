import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import {useGameStore} from '@/store/useGameStore'
import {SIZE, colors} from '@/utils/constants'
import Ionicons from '@expo/vector-icons/Ionicons'

interface KeyboardProps {
  handleGuess: (keyPressed: string) => void
}

const keys: string[][] = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<'],
]

const Keyboard = ({handleGuess}: KeyboardProps) => {
  const {usedKeys} = useGameStore((s) => s)

  /**
   * The function `handleKeyboardColor` takes a key as input and returns a color based on the value of
   * the key in the `usedKeys` object.
   * @param {string} key - The `key` parameter is a string that represents a specific key.
   * @returns The function `handleKeyboardColor` returns a color value based on the `key` parameter.
   */
  const handleKeyboardColor = (key: string) => {
    const keyData = usedKeys[key]
    if (keyData) {
      if (keyData === 'correct') {
        return colors.correct
      } else if (keyData === 'present') {
        return colors.present
      } else if (keyData === 'absent') {
        return colors.absent
      } else {
        return colors.keyDefault
      }
    } else {
      return colors.keyDefault
    }
  }

  return (
    <View style={styles.keyboardContainer}>
      {keys.map((row, idx) => (
        <View
          key={idx}
          style={{
            ...styles.keyboardRow,
            width: idx === 1 ? SIZE * 0.95 : SIZE,
          }}
        >
          {row.map((key, idx) => {
            const keyRowCount = row.length + 2
            return (
              <TouchableOpacity
                key={key}
                style={{
                  ...styles.keyContainer,
                  backgroundColor: handleKeyboardColor(key),
                  height: SIZE / keyRowCount + 2 + 20,
                  flex: key === '<' || key === 'Enter' ? 2 : 1,
                }}
                onPress={() => handleGuess(key)}
              >
                {key === '<' ? (
                  <Ionicons
                    name="backspace-outline"
                    style={{
                      ...styles.keyboardKey,
                      fontSize: 28,
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      ...styles.keyboardKey,
                      fontSize: key === 'Enter' ? 18 : 24,
                    }}
                  >
                    {key}
                  </Text>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      ))}
    </View>
  )
}

export default Keyboard

const styles = StyleSheet.create({
  keyboardContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  keyboardRow: {
    width: SIZE,
    marginBottom: 5,
    paddingHorizontal: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: 5,
  },
  keyboardKey: {
    textTransform: 'uppercase',
    color: 'white',
  },
})
