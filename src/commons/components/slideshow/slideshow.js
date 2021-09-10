import React, {useRef, useState} from 'react';
import {Animated, PanResponder, View, useWindowDimensions, Text } from 'react-native';

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

const getCardSize = ({height, width}) => {
	const vertical = 56 + 16 + (16 * 3) + 56;
	const horizontal = 16 * 2;

	return {
		width: width - horizontal,
		height: height - vertical
	};
};

const config = {
	0: Units.x6,
	1: Units.x3,
	2: Units.x0
}

const getInterpolations = ({stackLength, width}) => {
	return Array(stackLength - 1).fill().reduce((total, current, key) => {
		if(key === 0) {
			return [...total, {
				scale: {
					inputRange: [-width, 0, width],
					outputRange: [1, 0.9, 1]
				},
				translateY: {
					inputRange: [-width, 0, width],
					outputRange: [Units.x6, Units.x3, Units.x6]
				}
			}]
		} else {
			const {scale, translateY} = total[key - 1];
			return [...total, {
				scale: {
					inputRange: [-width, 0, width],
					outputRange: [scale.outputRange[1], scale.outputRange[1]-0.1, scale.outputRange[1]]
				},
				translateY: {
					inputRange: [-width, 0, width],
					outputRange: [Units.x3, Units.x0, Units.x3]
				}
			}];
		}
	}, []);
}

function Slideshow({data, stackLength}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const windowDimensions = useWindowDimensions();
	const cardSize = getCardSize(windowDimensions);
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

			if(currentIndex > key) {
				return null
			}
			if(currentIndex === key) {
				return (
					<Animated.View 
						key={Math.random()}
						{...panResponder.panHandlers}
						style={{
							...cardSize,
							transform: [{ translateX: pan}, {translateY: Units.x6 }],
							backgroundColor: colors[key],
							position: 'absolute',
							borderRadius: Units.x1,
							left: Units.x2
						}
					} />
				);
			} else {
				if(Math.abs(currentIndex - key) < stackLength) {
					return (
						<Animated.View 
							key={Math.random()}
							style={{
								...cardSize,
								left: Units.x2,
								transform: interpolations[index - 1],
								backgroundColor: colors[key],
								position: 'absolute',
								borderRadius: Units.x1
							}
						} />
					);
				} else {
					if(index === 3) {
						return (
							<Animated.View 
								key={Math.random()}
								style={{
									...cardSize,
									left: Units.x2,
									transform: [{scaleX: 0.8}],
									backgroundColor: colors[key],
									position: 'absolute',
									borderRadius: Units.x1
								}
							} />
						);
					}
					return null;
				}
			}
		}).reverse()}
		<Text style={{position: 'absolute', bottom: 0}} onPress={undo}>Try again</Text>
		</View>
	);
}

Slideshow.defaultProps = {
	stackLength: 3
}

export default Slideshow;