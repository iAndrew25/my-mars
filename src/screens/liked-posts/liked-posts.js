import React, { Fragment } from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import Placeholder from '../../commons/components/placeholder/placeholder';
import Header from '../../commons/components/header/header';
import Button from '../../commons/components/button/button';
import PostCard from './post-card/post-card';

function LikedPosts({ navigation }) {
	const likedPosts = useSelector(store => store.likedPosts);
	const handleOnNavigate = item => () => navigation.navigate('Post', item);

	return (
		<Fragment>
			<Header left={<Button icon="chevron-left" onPress={navigation.goBack} />} title="Liked posts" />
			{likedPosts.length ? (
				<FlatList
					data={likedPosts}
					keyExtractor={({ id }) => id}
					renderItem={({ item }) => <PostCard {...item} onPress={handleOnNavigate(item)} />}
				/>
			) : (
				<Placeholder text="There are no liked posts." />
			)}
		</Fragment>
	);
}

export default LikedPosts;
