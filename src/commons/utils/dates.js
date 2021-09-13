import {Months} from '../constants';

const parseDate = date => {
	const [year, month, day] = date.split('-');

	return `${Months[parseInt(month) - 1]} ${day}, ${year}`;
}

export {
	parseDate
};