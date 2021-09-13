import React, {Fragment, useState, useRef} from 'react';
import {ActivityIndicator, View, Text, StyleSheet} from 'react-native';
import { useDispatch } from 'react-redux';

import Placeholder from '../../commons/components/placeholder/placeholder';
import Slideshow from '../../commons/components/slideshow/slideshow';
import Header from '../../commons/components/header/header';
import Button from '../../commons/components/button/button';

import {likeAction, undoAction} from '../../config/store/actions';
import {AppContext} from '../../config/store/store';
import {Directions} from '../../commons/constants';
import Colors from '../../commons/colors';
import Units from '../../commons/units';

import {useFetch} from './main.service';
import {getCardsLeft} from './main.utils';

function Main({navigation}) {
	const dispatch = useDispatch();
	const {isLoading, error, data} = useFetch();
	const [currentIndex, setCurrentIndex] = useState(0);

	const navigateToLikedPosts = () => navigation.navigate('LikedPosts');

	const slideshowRef = useRef();
	const undo = () => {
		slideshowRef.current.undo() === Directions.right && dispatch(undoAction());
		setCurrentIndex(prevCurrentIndex => prevCurrentIndex - 1);
	};

	const handleOnSwipe = ({direction}) => {
		setCurrentIndex(prevCurrentIndex => {
			Directions.right === direction && dispatch(likeAction(data[prevCurrentIndex]));

			return prevCurrentIndex + 1
		});
	};

	const renderLoader = () => (
		<Placeholder>
			<ActivityIndicator size="large" color={Colors.primary} />
		</Placeholder>
	);

	const renderErrorMessage = () => (
		<Placeholder text={error} />
	);

	const renderEmptyPlaceholder = () => (
		<Placeholder text="No pictures left." />
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