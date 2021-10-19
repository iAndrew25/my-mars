import React, { Fragment } from 'react';
import { TouchableHighlight, Text, View, StyleSheet, Image } from 'react-native';

import { parseDate } from '../../../commons/utils/dates';
import Colors from '../../../commons/colors';
import Units from '../../../commons/units';

function PostCard({ src, photographer, photographer_url, onPress }) {
	return (
		<TouchableHighlight onPress={onPress} underlayColor={Colors.underlay} style={styles.wrapper}>
			<Fragment>
				<View style={styles.header}>
					<View style={styles.topHeader}>
						<Text style={styles.photographer}>{photographer}</Text>
					</View>
					<Text style={styles.photographerUrl}>{photographer_url}</Text>
				</View>
				<Image style={styles.image} source={{ uri: src.original }} />
			</Fragment>
		</TouchableHighlight>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		height: Units.x25,
		borderWidth: 1,
		overflow: 'hidden',
		borderRadius: Units.x2,
		marginVertical: Units.x1,
		marginHorizontal: Units.x2,
		borderColor: Colors.underlay,
		justifyContent: 'space-between'
	},
	header: {
		padding: Units.x1
	},
	photographer: {
		fontFamily: 'PTRootUI-Bold',
		color: Colors.primaryText,
		lineHeight: 24,
		fontSize: 16
	},
	photographerUrl: {
		fontFamily: 'PTRootUI-Medium',
		color: Colors.primaryText,
		lineHeight: 20,
		fontSize: 14
	},
	date: {
		fontFamily: 'PTRootUI-Regular',
		color: Colors.secondaryText,
		fontStyle: 'italic',
		lineHeight: 18,
		fontSize: 13
	},
	topHeader: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	image: {
		width: '100%',
		height: Units.x18
	}
});

export default PostCard;
