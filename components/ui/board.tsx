import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import {useGameStore} from '@/store/useGameStore'
import LetterPlaceholder from './letterPlaceholder'
import {HEIGHT, SIZE, colors} from '@/utils/constants'
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated'
import Keyboard from './keyboard'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

interface BoardProps {
  solution: string
  handleGuess: (keyPressed: string) => void
  resetGame: () => void
}

const Board = ({solution, handleGuess, resetGame}: BoardProps) => {
  const {guesses, gameEnded, wrongGuessShake} = useGameStore((s) => s)

  const inset = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.board,
        {
          paddingTop: inset.top,
          paddingBottom: inset.bottom + 50,
        },
      ]}
    >
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => resetGame()}
        >
          <Text style={styles.resetButtonText}>New Game</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.blocksContainer}>
        {guesses.map((guess, idx) => (
          <View key={idx} style={styles.squareBlock}>
            {guess.letters.map((letter, idx) => {
              return (
                <LetterPlaceholder
                  key={idx}
                  guess={guess}
                  letter={letter}
                  index={idx}
                />
              )
            })}
          </View>
        ))}
      </View>
      <View style={styles.gameResult}>
        {gameEnded && (
          <>
            <Text style={styles.solutionText}>Solution: {solution}</Text>
          </>
        )}
        {wrongGuessShake && (
          <Animated.Text
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.wrongGuessText}
          >
            Not in word list
          </Animated.Text>
        )}
      </View>
      <Keyboard handleGuess={handleGuess} />
    </View>
  )
}

export default Board

const styles = StyleSheet.create({
  board: {
    width: SIZE,
    height: HEIGHT,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  squareBlock: {
    width: SIZE * 0.9,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  topBarContainer: {
    width: SIZE,
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
  },
  blocksContainer: {
    width: SIZE * 0.9,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  gameResult: {
    width: SIZE,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  resetButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    widht: 170,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#404040',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 20,
  },
  solutionText: {
    fontSize: 16,
    color: 'white',
    textTransform: 'uppercase',
  },
  wrongGuessText: {
    fontSize: 16,
    color: 'white',
  },
})
