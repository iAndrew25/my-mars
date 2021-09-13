import React, {Fragment, useContext} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import { useSelector } from 'react-redux';
import {AppContext} from '../../config/store/store';

import Placeholder from '../../commons/components/placeholder/placeholder';
import Header from '../../commons/components/header/header';
import Button from '../../commons/components/button/button';
import PostCard from './post-card/post-card';

import Units from '../../commons/units';

function LikedPosts({navigation}) {
	const likedPosts = useSelector(store => store.likedPosts);

	return (
		<Fragment>
			<Header
				left={<Button icon="chevron-left" onPress={navigation.goBack}/>}
				title="Liked posts"
			/>
			{Boolean(likedPosts.length) ? 
				<FlatList
					data={likedPosts}
					keyExtractor={({id}) => id}
					renderItem={({item}) => <PostCard {...item} />}
				/>
			: <Placeholder text="There are no liked posts." />}
		</Fragment>
	);
}

export default LikedPosts;