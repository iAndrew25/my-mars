import Units from '../../units';

const getCardSize = ({height, width}, stackLength) => {
	const vertical = 
		// Header's height
		Units.x7 + 
		// Top margin
		Units.x2 + 
		// Stack margin
		(Units.x2 * stackLength) + 
		// Bottom margin
		Units.x7;
	const horizontal = Units.x2 * 2; // Horizontal margin

	return {
		width: width - horizontal,
		height: height - vertical
	};
};

const getInterpolationData = ({stackLength, width}) => {
	return Array(stackLength).fill().reduce((total, _, key) => {
		const initialScaleXOutput = [1, 0.9, 1];
		const inputRange = [-width, 0, width];
		const {scaleX} = total[key - 1] || {};
		const index = stackLength - key - 1;

		return [...total, {
			scaleX: {
				inputRange,
				outputRange: key === 0 ? initialScaleXOutput : [scaleX.outputRange[1], scaleX.outputRange[1] - 0.1, scaleX.outputRange[1]]
			},
			translateY: {
				inputRange,
				outputRange: [Units.x2 * index, Units.x2 * (index - 1), Units.x2 * index]
			}
		}];
	}, []);
}

export {
	getCardSize,
	getInterpolationData
};
