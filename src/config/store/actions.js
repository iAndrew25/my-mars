const likeAction = payload => ({type: 'LIKE', payload});
const undoAction = () => ({type: 'UNDO'});

export {
	likeAction,
	undoAction
};
