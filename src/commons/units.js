const BASE_UNIT = 8;

const Units = Array(25)
	.fill()
	.reduce((units, _, unit) => ({ ...units, [`x${unit}`]: unit * BASE_UNIT }), {});

export default Units;
