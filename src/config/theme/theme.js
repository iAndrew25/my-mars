import { DefaultTheme } from '@react-navigation/native';

import Colors from '../../commons/colors';

const Theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: Colors.background
	}
};

export default Theme;
