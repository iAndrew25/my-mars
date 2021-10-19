import React, { Fragment, useRef, forwardRef, useImperativeHandle } from 'react';
import { Animated, PanResponder, View, useWindowDimensions, StyleSheet } from 'react-native';

import Fab from './fab/fab';
import SlideshowCard from './slideshow-card/slideshow-card';
import { getCardSize, getInterpolationData, getButtonsInterpolationData } from './slideshow.utils';

import { Directions } from '../../constants';
import Colors from '../../colors';
import Units from '../../units';

function Slideshow({ data, onSwipe, stackLength, currentIndex, renderEmptyPlaceholder }, ref) {
	const windowDimensions = useWindowDimensions();
	const cardSize = getCardSize(windowDimensions, stackLength);
	const translateX = useRef(new Animated.Value(0)).current;
	const previousDirections = useRef([]).current;

	const swipeButtons = getButtonsInterpolationData({ ...windowDimensions, translateX });
	const interpolations = getInterpolationData({
		...windowDimensions,
		stackLength
	}).map(({ scaleX, translateY }) => [
		{
			scaleX: translateX.interpolate(scaleX)
		},
		{
			translateY: translateX.interpolate(translateY)
		}
	]);

	useImperativeHandle(ref, () => ({
		undo
	}));

	const swipe = direction => {
		Animated.spring(translateX, {
			toValue: direction * windowDimensions.width,
			restDisplacementThreshold: 100,
			restSpeedThreshold: 100,
			useNativeDriver: true
		}).start(() => {
			translateX.setValue(0);
			previousDirections.push(direction);
			onSwipe({ direction });
		});
	};

	const swipeRight = () => swipe(Directions.right);
	const swipeLeft = () => swipe(Directions.left);

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (event, { dx }) => translateX.setValue(dx),
			onPanResponderRelease: (event, { dx }) => {
				if (Math.abs(dx) < cardSize.width / 4) {
					Animated.spring(translateX, {
						toValue: 0,
						friction: 3,
						useNativeDriver: true
					}).start(() => {
						translateX.setValue(0);
					});
				} else {
					swipe(Math.sign(dx));
				}
			}
		})
	).current;

	const undo = () => {
		const previousDirection = previousDirections.pop();
		translateX.setValue(windowDimensions.width * (previousDirection || 1));

		Animated.spring(translateX, {
			toValue: 0,
			useNativeDriver: true
		}).start();

		return previousDirection;
	};

	const renderSlideshow = () => (
		<Fragment>
			{data
				.map(({ id, src, photographer, photographer_url }, key) => {
					const index = key - currentIndex;

					// Swiped cards
					if (currentIndex > key) {
						return null;
					}

					// Current card
					if (currentIndex === key) {
						return (
							<Animated.View
								key={id}
								{...panResponder.panHandlers}
								style={[
									styles.card,
									cardSize,
									{
										transform: [
											{
												translateX
											},
											{
												translateY: Units.x2 * (stackLength - index - 1)
											}
										]
									}
								]}>
								<SlideshowCard pictureUrl={src.original} title={photographer} subtitle={photographer_url} />
							</Animated.View>
						);
					}

					// Cards in stack
					if (Math.abs(currentIndex - key) < stackLength) {
						return (
							<Animated.View
								key={id}
								style={[
									styles.card,
									cardSize,
									{
										transform: interpolations[index - 1]
									}
								]}>
								<SlideshowCard pictureUrl={src.original} title={photographer} subtitle={photographer_url} />
							</Animated.View>
						);
					}

					// Last card hidden under stack
					if (index === stackLength) {
						return (
							<Animated.View
								key={id}
								style={[
									styles.card,
									cardSize,
									{
										transform: [interpolations[index - 1][0]]
									}
								]}>
								<SlideshowCard pictureUrl={src.original} title={photographer} subtitle={photographer_url} />
							</Animated.View>
						);
					}

					return null;
				})
				.reverse()}

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
		<View style={styles.wrapper}>{currentIndex < data.length ? renderSlideshow() : renderEmptyPlaceholder()}</View>
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
