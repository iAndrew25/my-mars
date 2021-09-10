import React, {useRef, useState} from 'react';
import {Animated, PanResponder, View, useWindowDimensions, Text, StyleSheet } from 'react-native';

import Units from '../../units';

const colors = {
	0: 'red',
	1: 'blue',
	2: 'green',
	3: 'yellow',
	4: 'pink',
	5: 'purple',
	6: 'tomato',
	7: 'black',
}

const DIRECTIONS = {
	LEFT: 'LEFT',
	RIGHT: 'RIGHT'
};

const getCardSize = ({height, width}, stackLength) => {
	const vertical = 56 + 16 + (16 * stackLength) + 56;
	const horizontal = 16 * 2;

	return {
		width: width - horizontal,
		height: height - vertical
	};
};
const translateYConfig = []
const config = {
	0: Units.x6,
	1: Units.x3,
	2: Units.x0
}

const getInterpolations = ({stackLength, width}) => {
	return Array(stackLength).fill().reduce((total, current, key) => {
		const inputRange = [-width, 0, width];
		const index = stackLength - key - 1;
		// const initialScaleOut

		if(key === 0) {
			return [...total, {
				scale: {
					inputRange,
					outputRange: [1, 0.9, 1]
				},
				translateY: {
					inputRange,
					outputRange: [Units.x2 * index, Units.x2 * (index - 1), Units.x2 * index]
				}
			}]
		} else {
			const {scale} = total[key - 1] || {scale: [{outputRange:[1, 0.9, 1]}]};

			return [...total, {
				scale: {
					inputRange,
					outputRange: [scale.outputRange[1], scale.outputRange[1] - 0.1, scale.outputRange[1]]
				},
				translateY: {
					inputRange,
					outputRange: [Units.x2 * index, Units.x2 * (index - 1), Units.x2 * index]
				}
			}];
		}
	}, []);
}
// 16 padding between header and slideshow
function Slideshow({data, stackLength}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const windowDimensions = useWindowDimensions();
	const cardSize = getCardSize(windowDimensions, stackLength);
	const pan = useRef(new Animated.Value(0)).current;
	const previousDirections = useRef([]).current;
	const interpolations = getInterpolations({stackLength, width: windowDimensions.width}).map(({scale, translateY}) => ([{
		scaleX: pan.interpolate(scale)
	}, {
		translateY: pan.interpolate(translateY)
	}]));

	const swipe = direction => () => {
		pan.setValue(0);
		previousDirections.push(direction);
		setCurrentIndex(prevCurrentIndex => prevCurrentIndex + 1);
	}

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (event, {dx}) => pan.setValue(dx),
			onPanResponderRelease: (event, {dx}) => {
				if(Math.abs(dx) < cardSize.width / 4) {
					Animated.spring(pan, {
						toValue: 0,
						friction: 3,
						useNativeDriver: true
					}).start(() => {
						pan.setValue(0)
					})
				} else {
					Animated.spring(pan, {
						toValue: Math.sign(dx) * windowDimensions.width,
						restDisplacementThreshold: 100,
						restSpeedThreshold: 100,
						useNativeDriver: true
					}).start(swipe(Math.sign(dx)));
				}
			}
		})
	).current;

	const undo = () => {
		setCurrentIndex(prevCurrentIndex => prevCurrentIndex - 1)
		pan.setValue(windowDimensions.width * (previousDirections.pop() || 1));
		Animated.spring(pan, {
			toValue: 0,
			useNativeDriver: true
		}).start();
	}

	return (
		<View>
		{data.map((i, key) => {
			const index = key - currentIndex;

			// Swiped cards
			if(currentIndex > key) {
				return null
			}

			// Current card
			if(currentIndex === key) {
				return (
					<Animated.View 
						key={Math.random()}
						{...panResponder.panHandlers}
						style={[styles.card, cardSize, {
							transform: [{ translateX: pan}, {translateY: Units.x2 * (stackLength - index - 1)}],
							backgroundColor: colors[key],
						}]
					} />
				);
			} 

			// Cards in stack
			if(Math.abs(currentIndex - key) < stackLength) {
				return (
					<Animated.View 
						key={Math.random()}
						style={[styles.card, cardSize, {
							transform: interpolations[index - 1],
							backgroundColor: colors[key],
						}]
					} />
				);
			}
			
			// Last card hidden under stack
			if(index === stackLength) {
				return (
					<Animated.View 
						key={Math.random()}
						style={[styles.card, cardSize, {
							transform: [interpolations[index - 1][0]],
							backgroundColor: colors[key]
						}]
					} />
				);
			}
			
			return null;
		}).reverse()}
		<Text style={{position: 'absolute', bottom: 0}} onPress={undo}>Try again</Text>
		</View>
	);
}

Slideshow.defaultProps = {
	stackLength: 3
}

const styles = StyleSheet.create({
	card: {
		borderRadius: Units.x1,
		position: 'absolute'
	}
});

export default Slideshow;