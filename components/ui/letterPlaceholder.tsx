import {View, Text, Vibration, StyleSheet} from 'react-native'
import React, {useEffect} from 'react'
import {guess, useGameStore} from '@/store/useGameStore'
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import {SIZE, colors} from '@/utils/constants'

interface LetterPlaceholderProps {
  guess: guess
  letter: string
  index: number
}

const LetterPlaceholder = ({guess, letter, index}: LetterPlaceholderProps) => {
  const {currentGuessIndex, wrongGuessShake} = useGameStore((s) => s)

  const scale = useSharedValue(1)
  const rotateDegree = useSharedValue(0)
  const progress = useDerivedValue(() => {
    return guess.isComplete
      ? withDelay(250 * index, withTiming(1))
      : withDelay(250 * index, withTiming(0))
  }, [guess])
  const shakeX = useSharedValue(0)
  const matchStatus = guess.matches[index]

  function matchColor() {
    'worklet'
    switch (matchStatus) {
      case 'correct':
        return colors.correct
      case 'present':
        return colors.present
      case 'absent':
        return colors.absent
      case '':
        return colors.keyDefault
      default:
        return colors.keyDefault
    }
  }

  const bgStyle = useAnimatedStyle(() => {
    const colorByMatchStatus = matchColor()
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.keyDefault, colorByMatchStatus]
    )
    return {backgroundColor}
  })

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: scale.value},
        {rotateY: `${rotateDegree.value}deg`},
        {translateX: shakeX.value},
      ],
    }
  })

  useEffect(() => {
    if (letter !== '' && matchStatus === '') {
      Vibration.vibrate(1)
      scale.value = withSequence(
        withTiming(1.2, {
          duration: 50,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withDelay(50, withTiming(1))
      )
    }

    if (matchStatus !== '') {
      rotateDegree.value = withSequence(
        withDelay(
          250 * index,
          withTiming(90, {
            duration: 250,
          })
        ),
        withDelay(
          250 * (index + 1),
          withTiming(0, {
            duration: 250,
          })
        )
      )
    }
  }, [letter, matchStatus])

  useEffect(() => {
    if (wrongGuessShake && currentGuessIndex === guess.id) {
      for (let i = 1; i < 6; i++) {
        shakeX.value = withSequence(
          withDelay(
            5 * i,
            withTiming(-1, {
              duration: 15,
              easing: Easing.linear,
            })
          ),
          withDelay(
            10 * i,
            withTiming(2, {
              duration: 30,
              easing: Easing.linear,
            })
          ),
          withDelay(
            15 * i,
            withTiming(-3, {
              duration: 45,
              easing: Easing.linear,
            })
          ),
          withDelay(
            20 * i,
            withTiming(3, {
              duration: 45,
              easing: Easing.linear,
            })
          ),
          withDelay(
            20 * i,
            withTiming(-2, {
              duration: 45,
              easing: Easing.linear,
            })
          ),
          withDelay(
            15 * i,
            withTiming(2, {
              duration: 45,
              easing: Easing.linear,
            })
          ),
          withDelay(
            10 * i,
            withTiming(-1, {
              duration: 45,
              easing: Easing.linear,
            })
          ),
          withDelay(
            5 * i,
            withTiming(0, {
              duration: 60,
              easing: Easing.linear,
            })
          )
        )
      }
    }
  }, [wrongGuessShake])

  return (
    <Animated.View
      key={index}
      style={[
        {
          ...styles.square,
          backgroundColor: matchColor(),
          borderWidth: guess.isComplete ? 0 : 1,
        },
        animatedStyles,
        bgStyle,
      ]}
    >
      <Text
        style={{
          ...styles.letter,
          color: 'white',
        }}
      >
        {letter}
      </Text>
    </Animated.View>
  )
}

export default LetterPlaceholder

const styles = StyleSheet.create({
  square: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE / 6.5,
    height: SIZE / 6.5,
    borderRadius: 10,
  },
  letter: {
    fontSize: SIZE / 12,
    fontWeight: 'bold',
    fontFamily: 'Menlo',
    textTransform: 'uppercase',
  },
})
