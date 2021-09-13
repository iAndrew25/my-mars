const reducer = (store, {type, payload}) => {
	switch(type) {
		case 'LIKE':
			return {
				...store,
				likedPosts: [...store.likedPosts, payload]
			};

		case 'UNDO':
			return {
				...store,
				likedPosts: store.likedPosts.slice(0, store.likedPosts.length - 1)
			};

		default:
			return store;
	}
}

export default reducer;