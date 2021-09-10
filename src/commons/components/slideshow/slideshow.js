import React, {useRef, useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {Animated, PanResponder, View, useWindowDimensions, Text, StyleSheet } from 'react-native';

import Fab from './fab/fab';
import {getCardSize, getCardsLeft, getInterpolationData} from './slideshow.utils';

import {Directions} from '../../constants';
import Colors from '../../colors';
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

function Slideshow({data, onSwipe, stackLength, currentIndex, setCurrentIndex}, ref) {
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

	useImperativeHandle(ref, () => ({
		undo
	}));

	const swipe = direction => {
		Animated.spring(pan, {
			toValue: direction * windowDimensions.width,
			restDisplacementThreshold: 100,
			restSpeedThreshold: 100,
			useNativeDriver: true
		}).start(() => {
			pan.setValue(0);
			previousDirections.push(direction);
			onSwipe({direction, cardIndex: currentIndex});
			setCurrentIndex(prevCurrentIndex => prevCurrentIndex + 1);
		});
	}

	const swipeRight = () => swipe(Directions.right);
	const swipeLeft = () => swipe(Directions.left);

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
					swipe(Math.sign(dx))
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
		<View style={styles.wrapper}>
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
							key={Math.random()} // temp
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

			<Fab
				bottom={Units.x1}
				left={Units.x2 + Units.x7}
				backgroundColor={Colors.black}
				icon="thumbs-down"
				onPress={swipeLeft}
			/>
			<Fab
				bottom={Units.x1}
				right={Units.x2 + Units.x7}
				backgroundColor={Colors.primary}
				icon="thumbs-up"
				onPress={swipeRight}
			/>
		</View>
	);
}

const SlideshowForwardedRef = forwardRef(Slideshow);

SlideshowForwardedRef.defaultProps = {
	stackLength: 3
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 1
	},
	card: {
		position: 'absolute',
		borderRadius: Units.x1
	}
});

export default SlideshowForwardedRef;