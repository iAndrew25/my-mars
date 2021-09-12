import React, {Fragment, useRef, useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {Animated, PanResponder, View, useWindowDimensions, Text, StyleSheet } from 'react-native';

import Fab from './fab/fab';
import SlideshowCard from './slideshow-card/slideshow-card';
import {getCardSize, getCardsLeft, getInterpolationData, getButtonsInterpolationData} from './slideshow.utils';

import {Directions} from '../../constants';
import Colors from '../../colors';
import Units from '../../units';

function Slideshow({data, onSwipe, stackLength, currentIndex, setCurrentIndex, renderEmptyPlaceholder}, ref) {
	const windowDimensions = useWindowDimensions();
	const cardSize = getCardSize(windowDimensions, stackLength);
	const pan = useRef(new Animated.Value(0)).current;
	const previousDirections = useRef([]).current;

	const swipeButtons = getButtonsInterpolationData({...windowDimensions, pan});
	const interpolations = getInterpolationData({
		...windowDimensions,
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
		const previousDirection = previousDirections.pop();
		setCurrentIndex(prevCurrentIndex => prevCurrentIndex - 1);
		pan.setValue(windowDimensions.width * (previousDirection || 1));
		Animated.spring(pan, {
			toValue: 0,
			useNativeDriver: true
		}).start();

		return previousDirection;
	}

	const renderSlideshow = () => (
		<Fragment>
			{data.map(({id, img_src, rover, earth_date, camera}, key) => {
				const index = key - currentIndex;

				// Swiped cards
				if(currentIndex > key) {
					return null
				}

				// Current card
				if(currentIndex === key) {
					return (
						<Animated.View 
							key={id}
							{...panResponder.panHandlers}
							style={[styles.card, cardSize, {
								transform: [{
									translateX: pan
								}, {
									translateY: Units.x2 * (stackLength - index - 1)
								}]
							}]
						}>
							<SlideshowCard
								pictureUrl={img_src}
								title={rover.name}
								subtitle={camera.full_name}
								date={earth_date}
							/>
						</Animated.View>
					);
				} 

				// Cards in stack
				if(Math.abs(currentIndex - key) < stackLength) {
					return (
						<Animated.View 
							key={id}
							style={[styles.card, cardSize, {
								transform: interpolations[index - 1]
							}]
						}>
							<SlideshowCard
								pictureUrl={img_src}
								title={rover.name}
								subtitle={camera.full_name}
								date={earth_date}
							/>
						</Animated.View>
					);
				}
				
				// Last card hidden under stack
				if(index === stackLength) {
					return (
						<Animated.View 
							key={id}
							style={[styles.card, cardSize, {
								transform: [interpolations[index - 1][0]]
							}]
						}>
							<SlideshowCard
								pictureUrl={img_src}
								title={rover.name}
								subtitle={camera.full_name}
								date={earth_date}
							/>
						</Animated.View>
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
				{...swipeButtons.swipeLeft}
			/>
			<Fab
				bottom={Units.x1}
				right={Units.x2 + Units.x7}
				backgroundColor={Colors.primary}
				icon="thumbs-up"
				onPress={swipeRight}
				{...swipeButtons.swipeRight}
			/>
		</Fragment>
	);

	return (
		<View style={styles.wrapper}>
			{currentIndex < data.length ? renderSlideshow() : renderEmptyPlaceholder()}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1
	},
	card: {
		position: 'absolute',
		borderRadius: Units.x1,
		overflow: 'hidden'
	}
});

export default forwardRef(Slideshow);