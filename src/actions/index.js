/* Мы здесь передаём request потому что он будет делать запрос по этому адрессу "http://localhost:3001/heroes" а эта 
сущность request у нас хранится в отдельном хуке 
   Здесь уже не dispatch(heroesFetching), а dispatch(heroesFetching()). Потому что когда мы запускам dispatch перед
ззапросом, то мы здесь устанавливаем индикатор Загрузки
    Дальше когда мы уже сделали запрос то мы вызываем другой екшенКриейтор heroesFetched с теми данными которые мы
получили от сервера (data) 
    Дальше эти данные мы передаем в качестве полезной нагрузки в наш reducer в Екшене heroesFetched в payload: heroes 
а туда они приходят в качестве аргумента (heroes) 
    Если будет ошибка то туда передается еще один ЕкшенКрейтор
    То-есть теперь у нас есть комплексный екшенКрейтор, который будет делать все за нас, он будет получать наших
героев и обрабатывать различные состояния*/
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

export const heroesFetching = () => {
    return {
        type: 'HEROES_FETCHING'
    }
}

export const heroesFetched = (heroes) => {
    return {
        type: 'HEROES_FETCHED',
        payload: heroes
    }
}

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

/* Так как мы подключили новый Middleware мы знаем что теперь мы сможем туда передать не только Объект(который возвращается
из этого екшенКрейтора) но и функцию
    Мы дописываем => (dispatch) =>
    То-есть теперь когда у нас вызывается екшенКрейтор(вот эта часть const activeFilterChanged = (filter) =>), то он
будет возвращать нам функцию, которая в себя принимает dispatch(и делает что-то внутри себя)
    Когда мы используем Thunk Middleware, то диспетч (dispatch) нам сюда приходит автоматически. Его не нужно не откуда
импортировать ! Он сам сюда прийдет и подставит сюда Thunk и уже будет использовать внутри этой функци
    Теперь нам нужно выполнить основную задачу, те взять и задиспетчить этотй Объект return {
        type: 'ACTIVE_FILTER_CHANGED',
        payload: filter
    } спустя определенное количество времени
    Bырызем полностью этот Объект и добавляем команду setTimeout
    Bнутри так как нам приходит (dispatch) внутри этой функции в качестве аргумента. То мы можем вызвать dispatch,
потом расскрыть его и во внутрь поместить тот Объект, который и будет являться нашим екшеном
    То-есть теперь мы возвращаем функцию, которая через одну секунду, будет запускать нужный нам Диспетч
    Происходит это из-за того что Middleware автоматически передаёт dispatch в возвращаемую функцию
    Это открывает нам кучу возможностей для наших фантазий ведь в этой функции может происходить всё что угодно
   */
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