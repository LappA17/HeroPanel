//import { createStore, combineReducers, compose, applyMiddleware } from 'redux'; 
import { configureStore } from '@reduxjs/toolkit'
// import ReduxThunk from 'redux-thunk' 
// import heroes from '../reducers/heroes' Вместо этого пишем так '../components/heroesList/heroesSlice'
import heroes from '../components/heroesList/heroesSlice'//потому что по дефолту импортируем reducer
import filters from '../reducers/filters';


const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
}

const store = configureStore({
    reducer: {heroes, filters},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
})

/* const store = createStore( 
                    combineReducers({heroes, filters}),
                    compose(applyMiddleware(ReduxThunk, stringMiddleware),
                            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                    )
                    // compose(
                      //  enhancer,
                      //  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                    // ) 
                    ); */

export default store;

/* const enhancer = (createStore) => (...args) => {
    const store = createStore(...args)

    const oldDispatch = store.dispatch
    store.dispatch = (action) => {
        if (typeof action === 'string') {
            return oldDispatch({
                type: action
            })
        }
        return oldDispatch(action)
    }
    return store
} */