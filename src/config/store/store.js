import { createStore } from 'redux';

import reducer from './reducer';
import initialStore from './initial-store';

const store = createStore(reducer, initialStore);

export default store;
