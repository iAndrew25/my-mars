const getCardsLeft = ({ total, currentIndex }) => {
	const cardsLeft = total - currentIndex;

	return cardsLeft ? `${cardsLeft} ${cardsLeft === 1 ? 'card' : 'cards'}` : '';
};

export { getCardsLeft };
