import React, {createContext, useReducer} from 'react';
import reducer from './reducer';
import initialStore from './initial-store';

const AppContext = createContext();

function StoreProvider({children}) {
	const [store, dispatch] = useReducer(reducer, initialStore);
	console.log("StoreProvider", store);

	return (
		<AppContext.Provider value={{store, dispatch}}>
			{children}
		</AppContext.Provider>
	);
};

export {AppContext};
export default StoreProvider;