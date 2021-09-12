import React, {Fragment, useState, useRef, useContext} from 'react';
import {ActivityIndicator, View, Text, StyleSheet} from 'react-native';

import Header from '../../commons/components/header/header';
import Button from '../../commons/components/button/button';
import Slideshow from '../../commons/components/slideshow/slideshow'

import {likeAction, undoAction} from '../../config/store/actions';
import {AppContext} from '../../config/store/store';
import {Directions} from '../../commons/constants';
import Colors from '../../commons/colors';
import Units from '../../commons/units';

import {useFetch} from './main.service';
import {getCardsLeft} from './main.utils';

function Main({navigation}) {
	const {dispatch} = useContext(AppContext);
	const {isLoading, error, data} = useFetch();
	const [currentIndex, setCurrentIndex] = useState(0);

	const navigateToLikedPosts = () => navigation.navigate('LikedPosts');

	const slideshowRef = useRef();
	const undo = () => {
		slideshowRef.current.undo() === Directions.right && dispatch(undoAction());
	};

	const handleOnSwipe = ({cardIndex, direction}) => {
		Directions.right === direction && dispatch(likeAction(data[cardIndex]))
	};

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

	const renderEmptyPlaceholder = () => (
		<View style={styles.centerWrapper}>
			<Text style={styles.text}>No pictures left.</Text>
		</View>
	);

	const renderSlideshow = () => (
		<Slideshow
			data={data}
			stackLength={3}
			ref={slideshowRef}
			onSwipe={handleOnSwipe}
			currentIndex={currentIndex}
			setCurrentIndex={setCurrentIndex}
			renderEmptyPlaceholder={renderEmptyPlaceholder}
		/>
	);

	return (
		<Fragment>
			<Header
				left={<Button isDisabled={currentIndex === 0} onPress={undo} text="Undo" />}
				right={<Button isDisabled={isLoading} onPress={navigateToLikedPosts} icon="heart-outlined" />}
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