import { configureStore } from '@reduxjs/toolkit';
//import heroes from '../components/heroesList/heroesSlice'; RTK Query заменил
import filters from '../components/heroesFilters/filtersSlice';
import { apiSlice } from '../api/apiSlice';
/* После того как импортировали apiSlice, нам нужно добавить новый reducer
[apiSlice.reducerPath] - это наше динамическое свойство в Объекте, по-этому мы ставим : и дальше помещаем reducer 
И что бы наш Query работал - нужно к нашему Стора подключить еще один Миддлвер - apiSlice.middleware
apiSlice.middleware - это готовый МидлВеер который существует внутри apiSlice*/

const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
};

const store = configureStore({
    reducer: {//heroes, RTK Query заменил
              filters, 
              [apiSlice.reducerPath]: apiSlice.reducer},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware, apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
})

export default store;