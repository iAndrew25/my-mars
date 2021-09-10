import React from 'react';
import {ImageBackground, Text, StyleSheet} from 'react-native';

import Units from '../../../units';
import Colors from '../../../colors';

import {parseDate} from './slideshow-card.utils';

function SlideshowCard({title, subtitle, date, pictureUrl}) {
	return (
		<ImageBackground source={{uri: pictureUrl}} resizeMode="cover" style={styles.wrapper}>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.text}>{subtitle}</Text>
			<Text style={styles.text}>{parseDate(date)}</Text>
		</ImageBackground>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		padding: Units.x2
	},
	title: {
		fontSize: 20,
		lineHeight: 28,
		color: Colors.white,
		fontFamily: 'PTRootUI-Medium',
		marginBottom: Units.x1 / 2
	},
	text: {
		fontSize: 14,
		lineHeight: 20,
		color: Colors.white,
		fontFamily: 'PTRootUI-Regular',
	}
});

export default SlideshowCard;