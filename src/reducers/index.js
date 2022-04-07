const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
    filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
    //filteredHeroes: [] больше не нужна так как мы создали filteredHeroes
}
/* Мы уже столкнулись с проблемой что наш reducer занимает слишком много строк. Прдеставь что ты работаешь с реальным
проектом и там таких фций и екшенов будет около сотни
    Екшены мы можем вынести в отдельные файлы, к примеру все екшены которые начинаются на HEROES_
    Но с редьсером так не получиться 
    
    Есть фция которая может комбинировать reducer и первое что нам прийдет в голову это разделить героев и фильтры
но у них здесь тесная взаимосвязь, потому что в одном объекте можем возвращать как и фильтры так и героев
    У нас есть filteredHeroes: action.payload === 'all' ? 
                                state.heroes :
                                state.heroes.filter(item => item.element === action.payload)
    К примеру этот код можно было бы отделить но он у нас ориентируется на список загруженных уже героев state.heroes
    При разделение reducerа нам нужно сделать так что бы эти зависимости полностью отделились друг от друга*/

/* Теперь в reducer стало намного меньше кода. 
    Нужно всегда стараться что бы в reducer были самые простые операции !!! - назначение данных без условий и жостких связей
    Теперь то что работает с героями - работает только с героями, то что с фильтрами - делаем только то что с фильтрами,
герои и фильтры уже не переплитаются */
const reducer = (state = initialState, action) => {
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
                /* filteredHeroes: state.activeFilter === 'all' ? 
                                action.payload : 
                                action.payload.filter(item => item.element === state.activeFilter), */
                heroesLoadingStatus: 'idle'
            }
        case 'HEROES_FETCHING_ERROR':
            return {
                ...state,
                heroesLoadingStatus: 'error'
            }
        case 'FILTERS_FETCHING':
            return {
                ...state,
                filtersLoadingStatus: 'loading'
            }
        case 'FILTERS_FETCHED':
            return {
                ...state,
                filters: action.payload,
                filtersLoadingStatus: 'idle'
            }
        case 'FILTERS_FETCHING_ERROR':
            return {
                ...state,
                filtersLoadingStatus: 'error'
            }   
        case 'ACTIVE_FILTER_CHANGED':
            return {
                ...state,
                activeFilter: action.payload, // мы лишь берем и изменяем активный фильтер внутри нашего глобального стейта
                /* filteredHeroes: action.payload === 'all' ? 
                                state.heroes :
                                state.heroes.filter(item => item.element === action.payload) 
                    Теперь мы не будем фильтровать в активном фильтре, потому что у нас есть filteredHeroes
                    */
            }
        case 'HERO_CREATED':
            //let newCreatedHeroList = [...state.heroes, action.payload]; Теперь вместо создание этой переменной
            return {
                ...state,
                heroes: [...state.heroes, action.payload] // мы можем на прямую использовать вот этот вот синтаксис
                /* filteredHeroes: state.activeFilter === 'all' ? 
                                newCreatedHeroList : 
                                newCreatedHeroList.filter(item => item.element === state.activeFilter) 
                САМОЕ ПРИЯТНО ЧТО ТЕПЕРЬ КОГДА МЫ СОЗДАЕМ И УДАЛЯЕМ ПЕРСОНАЖЕЙ ТО НАМ НЕ НУЖНО ИХ ПОВТОРНО ФИЛЬТРОВАТЬ*/
            }
        case 'HERO_DELETED': 
            //const newHeroList = state.heroes.filter(item => item.id !== action.payload);
            return {
                ...state,
                heroes: state.heroes.filter(item => item.id !== action.payload),
                /* filteredHeroes: state.activeFilter === 'all' ? 
                                newHeroList : 
                                newHeroList.filter(item => item.element === state.activeFilter) */
            }
        default: return state
    }
}

export default reducer;