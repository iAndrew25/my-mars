import React, {Fragment, useState, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Header from '../../commons/components/header/header';
import Button from '../../commons/components/button/button';
import Slideshow from '../../commons/components/slideshow/slideshow'

import Colors from '../../commons/colors';
import Units from '../../commons/units';

import {useFetch} from './main.service';
import {getCardsLeft} from './main.utils';

function Main({}) {
	const {isLoading, data} = useFetch();
	const [currentIndex, setCurrentIndex] = useState(0);

	const slideshowRef = useRef();
	const undo = () => slideshowRef.current.undo();
	const handleOnSwipe = direction => console.log('swiped', direction);

	return (
		<Fragment>
			<Header
				left={<Button isDisabled={currentIndex === 0} onPress={undo} text="Undo" />}
				title="My Mars"
				right={<Button onPress={console.log} icon="heart-outlined" />}
			/>
			<View style={styles.slideshowWrapper}>
				<Slideshow
					data={data}
					ref={slideshowRef}
					onSwipe={handleOnSwipe}
					currentIndex={currentIndex}
					setCurrentIndex={setCurrentIndex}
				/>
			<View style={styles.bottomWrapper}>
				<Text style={styles.cardsLeft}>
					{getCardsLeft({total: data.length, currentIndex})}
				</Text>
			</View>				
			</View>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	slideshowWrapper: {
		flexGrow: 1,
		padding: Units.x2
	},
	bottomWrapper: {
		position: 'absolute',
		bottom: Units.x2,
		right: 0,
		left: 0
	},
	cardsLeft: {
		fontFamily: 'PTRootUI-Regular',
		color: Colors.secondaryText,
		textAlign: 'center',
		lineHeight: 20,
		fontSize: 14
	}
});

export default Main;