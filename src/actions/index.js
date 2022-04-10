import { createAction } from "@reduxjs/toolkit"

export const fetchHeroes = (request) => (dispatch) => {
    dispatch(heroesFetching())
    request("http://localhost:3001/heroes")
        .then(data => dispatch(heroesFetched(data)))
        .catch(() => dispatch(heroesFetchingError()))
}

export const fetchFilters = (request) => (dispatch) => {
    dispatch(filtersFetching());
    request("http://localhost:3001/filters")
        .then(data => dispatch(filtersFetched(data)))
        .catch(() => dispatch(filtersFetchingError()))
}

export const heroesFetching = createAction('HEROES_FETCHING')
/* export const heroesFetching = () => {
    return {
        type: 'HEROES_FETCHING'
    }
} */

/* Хоть мы и не передавали payload: heroes, а просто оставили createAction('HEROES_FETCHED') то всё всё равно работает
   Все герои грузятся, страничка работает, хотя не было дополнительного передачи героев в пейлоде
   Дело в том что когда мы используем createAction, аргумент который приходит в ЕкшенКрейтор, автоматически переходит
в поле с названием payload. ТЕ вот эта вот часть у нас реализуется автоматически payload: heroes. По-этому в нашем
примере все работает. 
    Но если мы добавим дополнительные аргументы в вызов ЕкшенКрейтора, то они не будут никуда передаваться */
    export const heroesFetched = createAction('HEROES_FETCHED')
/* export const heroesFetched = (heroes) => {
    return {
        type: 'HEROES_FETCHED',
        payload: heroes
    }
} */

export const heroesFetchingError = createAction('HEROES_FETCHING_ERROR')
/* export const heroesFetchingError = () => {
    return {
        type: 'HEROES_FETCHING_ERROR'
    }
} */

export const filtersFetching = () => {
    return {
        type: 'FILTERS_FETCHING'
    }
}

export const filtersFetched = (filters) => {
    return {
        type: 'FILTERS_FETCHED',
        payload: filters
    }
}

export const filtersFetchingError = () => {
    return {
        type: 'FILTERS_FETCHING_ERROR'
    }
}

export const activeFilterChanged = (filter) => (dispatch) => {
    setTimeout(() => {
        dispatch({
            type: 'ACTIVE_FILTER_CHANGED',
            payload: filter
        }) 
    }, 500)
}

/* payload передается автоматически */
export const heroCreated = createAction('HERO_CREATED')
/* export const heroCreated = (hero) => {
    return {
        type: 'HERO_CREATED',
        payload: hero
    }
} */

export const heroDeleted = createAction('HERO_DELETED')
/* export const heroDeleted = (id) => {
    return {
        type: 'HERO_DELETED',
        payload: id
    }
} */