import { createStore, combineReducers, compose } from 'redux';
import heroes from '../reducers/heroes'
import filters from '../reducers/filters';

/* ...args - это мы передаем аргументы, ведь когда в createStore что-то приходит то сюда могут приходить еще дополнительные
аргументы combineReducers({heroes, filters}),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    
    ЭТОТ КОД В enhancer ПОЧТИ НИКОГДА НЕ БУДЕТ НУЖДЫ ПИСАТЬ САМОМУ, ОБЫЧНО ЕГО СКАЧИВАЮТ ИЗ БИБЛИОТЕКИ
    */
const enhancer = (createStore) => (...args) => {
    const store = createStore(...args)

    /* Сохраним оригинальный диспетч oldDispatch, потому фция диспетч содержиться внутри Стора. Этот диспетч принимал
в себя только Объект */
    const oldDispatch = store.dispatch

    /*Здесь мы взяли оригнальный Диспетч и переписали его. 
    Те мы сюда поместили новую функцию, которая внутри уже делает то что нам надо
    Здесь мы проверили что если action который приходит в эту фцию будет строкой
    То в таком случае мы вызываем оригинальный Диспетч, в него передаем Объект и этот Объект мы просто формируем руками
    И мы говорим что тип у нас будет тот который был сюда передан typeOf action  type: action, те строчка string */
    store.dispatch = (action) => {
        if (typeof action === 'string') {
            return oldDispatch({
                type: action
            })
        }
        /* А если нам пришла не строка, то мы возвращаем старый Диспетч с Екшеном 
        Потому что если это не строка, то это скорее всего у нас будет Объект и мы все так же помещаем Объект 
        в наш старый Диспетч */
        return oldDispatch(action)
    }
    return store /* Это как раз Стор с измененным Диспетчем как раз попадет в нашу главную переменную */
}

/* Здесь нас интересует оригинальная команда createStore 
   И в нее уже встроен механизм что если мы сюда вторыгм аргументом будем передавать какуе-то функцию - то она является
усилителем нашего стора. ТЕ она будет там запущена и подменит оригинальный Диспетч подставив тот фционал что мы написали */
const store = createStore( 
                    combineReducers({heroes, filters}),
                    compose(
                        enhancer,
                        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                    ));
/* Если мы просто через запятую добавим window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
то работать не будет
    В Редаксе есть специальная функция Компоус для соединения функций 
    Здесь важно что бы enhancer был перед window
    Потому что если поменять их местами то мы получим ошибку, потому что если первый наш enhancer получит в качестве
Екшена строку, он совершенно не знает что с ней вообще делать. 
    По-этому при приключение middleware как и enhacer нужно нужно соблюдать правильный порядок их работы*/

export default store;
