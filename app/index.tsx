import {StyleSheet, Touchable, TouchableOpacity} from 'react-native'

import {Text, View} from '@/components/Themed'
import Board from '@/components/ui/board'
import {guess, matchStatus, useGameStore} from '@/store/useGameStore'
import {useEffect} from 'react'
import {answers, words} from '@/words'

export default function Index() {
  const {
    guesses,
    usedKeys,
    currentGuessIndex,
    gameStarted,
    gameEnded,
    gameWon,
    solution,
    setUsedKeys,
    setGameEnded,
    setGuesses,
    setGameWon,
    setCurrentGuessIndex,
    resetGame,
    setWrongGuessShake,
  } = useGameStore((s) => s)

  /**
   * The function handles the found keys on the keyboard by updating the usedKeys object based on the
   * guess and matches.
   * @param {guess} guess - The `guess` parameter is an object that contains two properties:
   */
  const handleFoundKeysOnKeyboard = (guess: guess) => {
    const tempUsedKeys = {...usedKeys}
    guess.letters.forEach((letter: string, idx: number) => {
      const keyValue = tempUsedKeys[letter]
      if (!keyValue) {
        tempUsedKeys[letter] = guess.matches[idx]
      } else {
        if (keyValue === 'correct') return
        else if (keyValue && guess.matches[idx] === 'correct') {
          tempUsedKeys[letter] = 'correct'
        } else if (keyValue === 'present' && guess.matches[idx] !== 'correct')
          return
        else tempUsedKeys[letter] = guess.matches[idx]
      }
    })
    setUsedKeys(tempUsedKeys)
  }

  /**
   * The function "checkGameEnd" checks if the game has ended by counting the number of completed
   * guesses and setting the gameEnded state to true if the count is equal to 6.
   */
  const checkGameEnd = () => {
    console.log(solution)
    const attemptsCount = guesses.filter((guess: guess) => {
      return guess.isComplete
    }).length
    if (attemptsCount === 6) {
      setGameEnded(true)
    }
  }

  useEffect(() => {
    checkGameEnd()
  }, [currentGuessIndex])

  /**
   * The function `updateGuess` updates the current guess by adding a letter, removing a letter, or
   * moving to the next empty index.
   * @param {string} keyPressed - The `keyPressed` parameter is a string that represents the key that
   * was pressed by the user. It could be any character or special key, such as a letter, number, or
   * arrow key.
   * @param {guess} currentGuess - The `currentGuess` parameter is an object that represents the
   * current guess. It has a property called `letters` which is an array of strings representing the
   * letters in the guess.
   */
  const updateGuess = (keyPressed: string, currentGuess: guess) => {
    const currentGuessLetters = [...currentGuess.letters]
    let nextEmptyIndex = currentGuessLetters.findIndex(
      (letter) => letter === ''
    )

    if (nextEmptyIndex === -1) nextEmptyIndex = 5
    const lastNonEmptyIndex = nextEmptyIndex - 1
    if (keyPressed !== '<' && keyPressed !== 'Enter' && nextEmptyIndex < 5) {
      currentGuessLetters[nextEmptyIndex] = keyPressed
      const updatedGuess = {
        ...currentGuess,
        letters: currentGuessLetters,
      }
      const updatedGuesses = guesses.map((guess, idx) => {
        if (idx === currentGuessIndex) return updatedGuess
        else return guess
      })
      setGuesses([...updatedGuesses])
    } else if (keyPressed === '<') {
      currentGuessLetters[lastNonEmptyIndex] = ''
      const updatedGuess = {
        ...currentGuess,
        letters: currentGuessLetters,
      }
      const updatedGuesses = guesses.map((guess, idx) => {
        if (idx === currentGuessIndex) return updatedGuess
        else return guess
      })
      setGuesses([...updatedGuesses])
    }
  }

  /**
   * The function `wordsList` concatenates two arrays, `words` and `answers`, and returns the resulting
   * array.
   * @returns The function `wordsList` is returning a new array that combines the elements of the
   * `words` array and the `answers` array.
   */
  const wordsList = () => {
    return words.concat(answers)
  }

  /**
   * The function `checkGuess` takes a current guess and checks if it matches the solution, updating
   * the guesses and game status accordingly.
   * @param {guess} currentGuess - The `currentGuess` parameter is an object that represents the
   * current guess made by the player. It has the following properties:
   */
  const checkGuess = (currentGuess: guess) => {
    const currentGuessedWord = currentGuess.letters.join('')
    if (currentGuessedWord.length === 5) {
      if (currentGuessedWord === solution) {
        const matches: matchStatus[] = [
          'correct',
          'correct',
          'correct',
          'correct',
          'correct',
        ]

        const updatedGuess = {
          ...currentGuess,
          matches,
          isComplete: true,
          isCorrect: true,
        }
        const updatedGuesses = guesses.map((guess, idx) => {
          if (idx === currentGuessIndex) return updatedGuess
          else return guess
        })
        setGuesses(updatedGuesses)
        setTimeout(() => {
          setGameWon(true)
          setGameEnded(true)
          handleFoundKeysOnKeyboard(updatedGuess)
        }, 250 * 6)
      } else if (wordsList().includes(currentGuessedWord)) {
        const matches: matchStatus[] = []
        currentGuessedWord.split('').forEach((letter, index) => {
          const leftSlice = currentGuessedWord.slice(0, index + 1)
          const countInLeft = leftSlice
            .split('')
            .filter((item) => item === letter).length
          const totalCount = solution
            .split('')
            .filter((item) => item === letter).length
          const nonMatchingPairs = solution
            .split('')
            .filter((item, idx) => currentGuessedWord[idx] !== item)

          if (letter === solution[index]) {
            matches.push('correct')
          } else if (solution.includes(letter)) {
            if (
              countInLeft <= totalCount &&
              nonMatchingPairs.includes(letter)
            ) {
              matches.push('present')
            } else {
              matches.push('absent')
            }
          } else {
            matches.push('absent')
          }
        })

        const updatedGuess = {
          ...currentGuess,
          matches,
          isComplete: true,
          isCorrect: false,
        }

        const updatedGuesses = guesses.map((guess, idx) => {
          if (idx === currentGuessIndex) return updatedGuess
          else return guess
        })

        setGuesses(updatedGuesses)
        setCurrentGuessIndex(currentGuessIndex + 1)
        handleFoundKeysOnKeyboard(updatedGuess)
      } else {
        setWrongGuessShake(true)
        setTimeout(() => {
          setWrongGuessShake(false)
        }, 1000)
      }
    }
  }

  /**
   * The function `handleGuess` updates the current guess based on the key pressed and checks if the
   * guess is correct.
   * @param {string} keyPressed - The `keyPressed` parameter is a string that represents the key that
   * was pressed by the user.
   */
  const handleGuess = (keyPressed: string) => {
    if (!gameEnded) {
      const currentGuess = guesses[currentGuessIndex]
      if (currentGuess) {
        if (keyPressed !== 'Enter' && !currentGuess.isComplete) {
          updateGuess(keyPressed, currentGuess)
        } else if (keyPressed === 'Enter' && !gameWon) {
          checkGuess(currentGuess)
        }
      }
    }
  }

  if (!gameStarted) {
    return (
      <View style={styles.startGameScreen}>
        <TouchableOpacity onPress={() => resetGame()}>
          <Text>Start Game</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View
      style={{
        position: 'relative',
      }}
    >
      <Board
        solution={solution}
        handleGuess={handleGuess}
        resetGame={() => resetGame()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  startGameScreen: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
