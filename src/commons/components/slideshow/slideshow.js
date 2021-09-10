import React, {useRef, useState} from 'react';
import {Animated, PanResponder, View, useWindowDimensions, Text, StyleSheet } from 'react-native';

import {getCardSize, getInterpolationData} from './slideshow.utils';
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

function Slideshow({data, stackLength}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const windowDimensions = useWindowDimensions();
	const cardSize = getCardSize(windowDimensions, stackLength);
	const pan = useRef(new Animated.Value(0)).current;
	const previousDirections = useRef([]).current;
	const interpolations = getInterpolationData({
		width: windowDimensions.width,
		stackLength
	}).map(({scaleX, translateY}) => ([{
		scaleX: pan.interpolate(scaleX)
	}, {
		translateY: pan.interpolate(translateY)
	}]));

	const swipe = direction => () => {
		pan.setValue(0);
		previousDirections.push(direction);
		setCurrentIndex(prevCurrentIndex => prevCurrentIndex + 1);
	};

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