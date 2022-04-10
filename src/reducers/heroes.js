/* Так как мы создали heroesSlice то наш reducer heroes.js мы можем спокойно УДАЛИТЬ */
import { createReducer } from "@reduxjs/toolkit"

import {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} from '../actions'

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'
}


/* const heroes = createReducer(initialState, builder => {
    builder //вызываем объект
        .addCase(heroesFetching, state => {
            state.heroesLoadingStatus = 'loading' // библиотека поймет что нужно сделать и будет соблюдать Иммутабильность
        }) 
        .addCase(heroesFetched, (state, action) => {
            state.heroesLoadingStatus = 'idle'
            state.heroes = action.payload
        })
        .addCase(heroesFetchingError, state => {
            state.heroesLoadingStatus =  'error'
        })
        .addCase(heroCreated, (state, action) => {
            state.heroes.push(action.payload)
        })
        .addCase(heroDeleted, (state,action) => {
            state.heroes = state.heroes.filter(item => item.id !== action.payload)
        })
        .addDefaultCase(() => {}) //Это аналог Дефолта. Сюда обычно пишут пустую фцию, она будет вызываться если вдруг
        //не найден action и наш Стейт останется точно таким же 
}) */

/* const heroes = (state = initialState, action) => {
    switch (action.type) {
        case 'HEROES_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading'
            }
        case 'HEROES_FETCHED':
            return {
                ...state,
                heroes: action.payload,
                heroesLoadingStatus: 'idle'
            }
        case 'HEROES_FETCHING_ERROR':
            return {
                ...state,
                heroesLoadingStatus: 'error'
            }
        case 'HERO_CREATED':
            return {
                ...state,
                heroes: [...state.heroes, action.payload]
            }
        case 'HERO_DELETED': 
            return {
                ...state,
                heroes: state.heroes.filter(item => item.id !== action.payload)
            }
        default: return state
    }
} */

/* Так же есть второй вариант работы с createReducer, он работает только с ЖС, с ТайпКриптом работать не будет  
   Вторым аргументом будет Объект вместо builder, где ключами будут actionCreator а их свойства - выполняемые действиеми
   Здесь нужно будет пользоваться фишкой ЕС6 стандарта и будем динамически создавать ключи нашего Объекта
   Выклядит это след образом - мы открываем [] и помещаем туда actionCreator и так как это объект пишем : и туда 
помещаем фцию которая изменяет наш Стейт
   Здесь работает тоже самое правило со словом return или писание кода в одну строчку state => state.heroesLoadingStatus = 'loading'
   Что бы писать в одну строчку можно написать вот так state => {state.heroesLoadingStatus = 'loading'}
   
   В таком формате createReducer имеет три метода - ВТОРОЙ это массив сравнения - он нам не нужен по-этому осталяем
пустой массив []
   Третий - это как раз default, но здесь мы прописываем state => state */
   const heroes = createReducer(initialState, {
    [heroesFetching]: state => {state.heroesLoadingStatus = 'loading'},
    [heroesFetched]: (state, action) => {
                    state.heroesLoadingStatus = 'idle';
                    state.heroes = action.payload;
                },
    [heroesFetchingError]: state => {
                    state.heroesLoadingStatus = 'error';
                },
    [heroCreated]: (state, action) => {
                    state.heroes.push(action.payload);
                },
    [heroDeleted]: (state, action) => {
                    state.heroes = state.heroes.filter(item => item.id !== action.payload);
                }
        },
    [],
    state => state
)
            
export default heroes;