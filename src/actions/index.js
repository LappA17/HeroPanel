/* Мы уже понимаем что когда мы создаем екшенКрейторы, то у нас очень много одинакового кода
   createAction решает эту проблему */
import { createAction } from "@reduxjs/toolkit"

/* Сделаем Комплексный actionCreator и передадим строку "ewerre" в .then(data => dispatch(heroesFetched(data, "ewerre")))
   Заходим на страницу, получаем всех героев, но мы вообщем-то не видим нигде эту строку, потому что она просто
игнорируется, а все данные которые у нас пришли переходят в payload. Часть функцоинала createAction делает за нас

    Иногда приходится payload нужно создавать вручную. 
    Здесь есть очень важное правило - стараться в reducer не передавать больше одного поля, все действие которое нужно
выполнить нужно стараться выполнить в actioncREATORах. И уже потом когда данные готовые - передаем в редьюсер только
одно значение(которое вообщем-то приходит в качестве payload) так наш код будет простым и удобным 

    В функцию createAction всегда передавать только строки первым аргументом ! */
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

/* export const heroesFetching = () => {
    return {
        type: 'HEROES_FETCHING'
    }
} */

// Так как у нас очень простой тип действие то просто подставляем 'HEROES_FETCHING'
// Теперь он создается при помощи одной строки а не 4
export const heroesFetching = createAction('HEROES_FETCHING')

/* export const heroesFetched = (heroes) => {
    return {
        type: 'HEROES_FETCHED',
        payload: heroes
    }
} */

/* Хоть мы и не передавали payload: heroes, а просто оставили createAction('HEROES_FETCHED') то всё всё равно работает
   Все герои грузятся, страничка работает, хотя не было дополнительного передачи героев в пейлоде
   Дело в том что когда мы используем createAction, аргумент который приходит в ЕкшенКрейтор, автоматически переходит
в поле с названием payload. ТЕ вот эта вот часть у нас реализуется автоматически payload: heroes. По-этому в нашем
примере все работает. 
    Но если мы добавим дополнительные аргументы в вызов ЕкшенКрейтора, то они не будут никуда передаваться 
    Поднимаему выше в fetchHeroes там где мы работали с сервером*/
export const heroesFetched = createAction('HEROES_FETCHED')

export const heroesFetchingError = () => {
    return {
        type: 'HEROES_FETCHING_ERROR'
    }
}

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

export const heroCreated = (hero) => {
    return {
        type: 'HERO_CREATED',
        payload: hero
    }
}

export const heroDeleted = (id) => {
    return {
        type: 'HERO_DELETED',
        payload: id
    }
}