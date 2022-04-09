//import { createStore, combineReducers, compose, applyMiddleware } from 'redux'; ЭТО ВСЕ ТОЖЕ НЕ ИСПОЛЬЗУЕТСЯ, ТУЛЛКИТ ВСЕ ЗАМЕНИЛ
import { configureStore } from '@reduxjs/toolkit'
// import ReduxThunk from 'redux-thunk' уже не нужен так как он уже включен в ТУЛЛКИТ
import heroes from '../reducers/heroes'
import filters from '../reducers/filters';
/* Redux/toolkit - это всего лишь инстуремент для того что бы код писать намного удобней и локаничней. Он ничего не 
вносит в логику работы с хранилищем, а просто дает удобные инстументы для написание кода. Так что все базовые знания
нам нужны */
/* Обозначим часть проблем которые могут возникать при разработке больших приложений
   1) Очень много повторений кода при создание Редьюсеров и Екшенкрейтеров
   2) Хотелось бы удобней создавать Стор, смущает конструкция по РедаксДивтулс и включений Миддлевейеров, тяжелая конструкция
   3) Когда у нас будут очень вложенные структуры, которые лежат внутри Стора, то не очень приятно будет соблюдать 
иммутабильность и что-то менять внутри. На данном этапе у нас всё прсто - у нас есть массив с Объектами, где мы 
что-то там меняем, в нашем приложение - это добавление и удаление героев. Но представь что каждый Объект героя
у нас содержал бы тоже поля, который был бы Объектами. К примеру у каждого героя могла бы быть предметы и их количества
и мы могли бы на странице менять это кство, то нам внутри вложенных структур что бы изменить такой простой параметр 
как кство пришлось бы написать огромный код, так как нужно соблюдать иммутабильность,  с разворот каждого Объекта 

    Функция configureStore нужна для того что бы удобно и автоматически комбинировать Редьюсеры. Подключать дополнительный
фцинал под название Middlewares и enhancer и автоматически включать Девтулс без той страшной строки */

const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
}

/* В reducer мы передаем Объект с нашими Редьюсерами
   Здесь мы так же как и в combineReducers создаем пару ключ - значения: heroes, filters - это сокращение записей Объекта 
   Вторым параметром принимает Девтулс. Больше не нужно писать ту огромную строку. Девтулс принимает либо тру либо фолс
но если только оставить тру то в проадкшен версии он тоже останиться - по-этому нужно прописать конструкция которая
будет автоматиески вычеслять нужно ли нам сейчас включать Девтулс или нет, взвависимости от того какой у нас сейчас
билд: продакшн или девелопмент. process.env.NODE_ENV - это с НОД ЖС, если у нас не продакшен то девтулс включен, если 
продакшен то выключаем
    Дальше идут middleware - это РедаксТанк и наш который мы создали
    В Тулките пошли дальше, так как почти всегда Thunk исопльзуется, то они его уже содержат по дефолту, их там всего 3
1) Serializability Middleware - этот мидлвеер служит для того что бы проверять что в Сторе у нас нет данных которых не
должно быть там: символы, промисы, фции и тд
2) Immutability Middleware - для того что бы обнаруживать мутация, которые могут быть в нашем Сторе
3) Thunk Middleware 
    Все они ТРОЯ сразу включены в РЕДАКС ТУЛКИТ. Что бы их получить мы пишем getDefaultMiddleware - возвращает массив
тех Миддлверов которые уже включены в РЕДАКС ТУЛКИТ. По-этому так больше можем НЕ ПИСАТЬ middleware: [ReduxThunk, stringMiddleware]
     getDefaultMiddleware => getDefaultMiddleware() первый - это аргумент который будет подставлен автоматически,
а внутри этой фции мы запускаем getDefaultMiddleware(). Мы получаем дефолтные мидлверы в виде массива и дальше к 
этим мидлеверам добавляем собственный concat(stringMiddleware) */
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