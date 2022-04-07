import { createStore, combineReducers } from 'redux';
// import reducer from '../reducers'; Так как мы созадли два отдельные Редьюсера уже не нужен этот файлк
import heroes from '../reducers/heroes'
import filters from '../reducers/filters';

/* Когда мы в Объекте прописываем одно свойство heroes - это значит что мы пропиываем heroes: heroes */
const store = createStore( combineReducers({heroes, filters}),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;