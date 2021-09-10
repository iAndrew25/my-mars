import React, {Fragment, useState, useRef} from 'react';
import {ActivityIndicator, View, Text, StyleSheet} from 'react-native';

import Header from '../../commons/components/header/header';
import Button from '../../commons/components/button/button';
import Slideshow from '../../commons/components/slideshow/slideshow'

import Colors from '../../commons/colors';
import Units from '../../commons/units';

import {useFetch} from './main.service';
import {getCardsLeft} from './main.utils';

function Main({}) {
	const {isLoading, error, data} = useFetch();
	const [currentIndex, setCurrentIndex] = useState(0);

	const slideshowRef = useRef();
	const undo = () => slideshowRef.current.undo();
	const handleOnSwipe = direction => console.log('swiped', direction);

	const renderSlideshow = () => {
		if(currentIndex < data.length) {
			return (
				<Slideshow
					data={data}
					ref={slideshowRef}
					onSwipe={handleOnSwipe}
					currentIndex={currentIndex}
					setCurrentIndex={setCurrentIndex}
				/>
			);
		} else {
			return (
				<View style={styles.centerWrapper}>
					<Text style={styles.text}>No pictures left.</Text>
				</View>
			);
		}
	}

	const renderLoader = () => (
		<View style={styles.centerWrapper}>
			<ActivityIndicator size="large" color={Colors.primary} />
		</View>		
	);

	const renderErrorMessage = () => (
		<View style={styles.centerWrapper}>
			<Text style={styles.text}>{error}</Text>
		</View>
	);

	return (
		<Fragment>
			<Header
				left={<Button isDisabled={currentIndex === 0} onPress={undo} text="Undo" />}
				right={<Button onPress={console.log} icon="heart-outlined" />}
				title="My Mars"
			/>
			<View style={styles.slideshowWrapper}>
				{isLoading 
					? renderLoader() 
					: Boolean(error) 
						? renderErrorMessage() 
						: renderSlideshow()
				}
				<View style={styles.bottomWrapper}>
					<Text style={styles.text}>
						{isLoading ? 'Downloading' : getCardsLeft({total: data.length, currentIndex})}
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
	centerWrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	bottomWrapper: {
		position: 'absolute',
		bottom: Units.x2,
		right: 0,
		left: 0
	},
	text: {
		fontFamily: 'PTRootUI-Regular',
		color: Colors.secondaryText,
		textAlign: 'center',
		lineHeight: 20,
		fontSize: 14
	}
});

export default Main;