const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
    filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: 'all',
    filteredHeroes: []
}

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
                // ЭТО МОЖНО СДЕЛАТЬ И ПО ДРУГОМУ
                // Я специально показываю вариант с действиями тут, но более правильный вариант
                // будет показан в следующем уроке
                filteredHeroes: state.activeFilter === 'all' ? 
                                action.payload : 
                                action.payload.filter(item => item.element === state.activeFilter),
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

        /* Здесь мы записываем не только в поле Активного Фильтра(activeFilterChanged) то что у нас было выбранно(action.payload)
        Но при этом мы должны сразу отобразить какие-то изменения в качестве героев на странице, мы должны их отфильтровать
        по-этому здесь есть поле отфильтрованных героев filteredHeroes, которые используется внутри HeroesList
        Вместо обычных героев мы в HeroesList передаем const {filteredHeroes, heroesLoadingStatus} = useSelector(state => state)
        и уже это поле мы используем что бы отрендерить геров const elements = renderHeroesList(filteredHeroes)
        Тепперь у меня есть два поля: 1) заключает в себя просто всех героев heroes: [], которые мы получили с Сервера, 
        потому что запросс мы делаем только один раз. 2) поле которое будет отвечать за то что мы сюда действительно
        будем помещать героев которые будут отображаться в нашей верстке filteredHeroes 
        ЭТА ФИЛЬТРАЦИЯ ДОЛЖНА ПРОИСХОДИТЬ В НЕСКОЛЬКИХ МЕСТАХ. КОГДА У МЕНЯ ACTIVE_FILTER_CHANGED ТО ЭТА ФИЛЬТРАЦИЯ 
        САМО СОБОЙ ДОЛЖНА ПРОИСХОДИТЬ
        ПОТОМ КОГДА МЫ СОЗДАЕМ НОВОГО ГЕРОЯ HERO_CREATED, У НАС ЭТОТ ГЕРОЙ ПРИХОДИТ В СПИСОК ГЕРОЕВ И В ТАКОМ СЛУЧАЕ
        МЫ ДОЛЖНЫ ЕГО СРАЗУ ОТФИЛЬТРОВАТЬ И ПОМЕСТИТЬ НА СТРАНИЦУ ЕСЛИ ОН ПОДХОДИТ ПОД ФИЛЬТЕР
        ТОЖЕ САМОЕ И ПРОИСХОДИТ С УДАЛЕННЫММ ГЕРОЕМ HERO_DELETED - ЕСЛИ МЫ ЕГО УДАЛИЛИ ТО НАМ НУЖНО ЕГО УБРАТЬ ИЗ
        ОТФИЛЬТРОВАННЫХ ГЕРОЕВ
        И ПОСЛЕДНЕЕ ЭТО САМАЯ НАЧАЛЬНАЯ ФИЛЬТРАЦИЯ HEROES_FETCHED КОГДА МЫ ТОЛЬКО ПОЛУЧИЛИ ГЕРОЕВ, МЫ ЗАПИСАЛИ ВСЕХ
        ГЕРОЕВ ВОТ СЮДА heroes: action.payload, НО ПРИ ЭТОМ СРАЗУ УКАЗАЛИ ТО ЧТО ДОЛЖНО БЫЛО БЫТЬ ОТОБРАЖЕННО НА СТРАНИЦЕ
        ВЕДЬ НА ДАННЫЙ МОМЕНТ У НАС ГЛАВНЫЙ ФИЛЬТЕР СТОИТ activeFilter: 'all', НО ТАК МОЖЕТ БЫТЬ НЕ ВСЕГДА ВЕДЬ МОЖЕТ 
        В НАЧАЛЕ МЫ ЗАХОТИМ ПОКАЗЫВАТЬ НА СТРАНИЦЕ ГЕРОЕВ С ОГНЕННЫМ ЭЛЕМЕНТОМ, И БУДЕТ СТОЯТЬ fire ПО-ЭТОМУ МЫ КОГДА
        ПОЛУЧАЕМ ГЕРОЕВ heroes: action.payload В HEROES_FETCHED, ТО НАМ НУЖНО ОТОБРАЗИТЬ ПРИ ПОМОЩИ УСЛОВИЯ filteredHeroes
        */    
        case 'ACTIVE_FILTER_CHANGED':
            return {
                ...state,
                activeFilter: action.payload,
                filteredHeroes: action.payload === 'all' ? 
                                state.heroes :
                                state.heroes.filter(item => item.element === action.payload)
            }
        // Самая сложная часть - это показывать новые элементы по фильтрам
        // при создании или удалении
        /* Что бы создать нового героя мы сначала разворачиваем героев В НОВЫЙ МАССИВ ...state.heroes, что бы соблюдать
        принцип иммутабильности, и уже потом добавляем нового action.payload, которого мы создавали при помощи формы
        В action.payload у нас приходил Объект*/
        case 'HERO_CREATED':
            // Формируем новый массив    
            let newCreatedHeroList = [...state.heroes, action.payload];
            return {
                ...state,
                heroes: newCreatedHeroList,
                // Фильтруем новые данные по фильтру, который сейчас применяется
                filteredHeroes: state.activeFilter === 'all' ? 
                                newCreatedHeroList : 
                                newCreatedHeroList.filter(item => item.element === state.activeFilter)
            }
        
        /* Здесь мы формируем новый список героев newHeroList при помощи фции фильтер
        filter - возвращает новый массив, мы соблюдаем принцип иммутабильности
        Дальше этот новый список мы помещаем в героев, потому что оттуда был удален какой-то элемент
        Те мы в наш стейт с героями помещаем новый массив(как стейт) уже с новыми героями без того что удалили
        Так же у нас есть фильтрованные герои - тех которые мы отображаем на странице filteredHeroes */
        case 'HERO_DELETED': 
            // Формируем новый массив
            const newHeroList = state.heroes.filter(item => item.id !== action.payload);
            return {
                ...state,
                heroes: newHeroList,
                // Фильтруем новые данные по фильтру, который сейчас применяется
                filteredHeroes: state.activeFilter === 'all' ? 
                                newHeroList : 
                                newHeroList.filter(item => item.element === state.activeFilter)
            }
        default: return state
    }
}

export default reducer;