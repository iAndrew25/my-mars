import React, { Fragment } from 'react';
import { StyleSheet, Image } from 'react-native';

import Header from '../../commons/components/header/header';
import Button from '../../commons/components/button/button';

function Post({ navigation, route }) {
	const { rover, img_src } = route.params;

	return (
		<Fragment>
			<Header left={<Button icon="chevron-left" onPress={navigation.goBack} />} title={rover.name} />
			<Image style={styles.image} source={{ uri: img_src }} />
		</Fragment>
	);
}

const styles = StyleSheet.create({
	image: {
		flex: 1,
		width: '100%',
		height: '100%',
		resizeMode: 'cover'
	}
});

export default Post;
