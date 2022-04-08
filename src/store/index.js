import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import heroes from '../reducers/heroes'
import filters from '../reducers/filters';

/* Если enhancer мог разшерять любую часть Стора, то middleware занимается именно фцией Диспетч(что почти всегда нам и 
нужно) 
    Фция stringMiddleware будет принимать в себя store
    Эта фция будет возвращать другую фцию, которая автоматически будет подхватывать метод dispatch
    А эта функция в свою очередь будет возвращать еще одну фцию, которая как аргумент будет принимать action и этот 
action потом будет передаваться в dispatch
    По-факту эта фция (action) => {} и есть новая фция dispatch которая имеет измененный функционал
    if (typeof action === 'string') {
        return dispatch({
            type: action
        })
    }
    return dispatch(action)
    На этом всё, весь stringMiddleware уже работает. 
    В enhacer нам сначало скопировать ссылку на старый Диспетч
    потом перезаписать в сторе новую нашу фцию
    и в итоге вернуть немножко измененный стор с другим диспетчем

    Здесь же мы сразу возвращаем фцию dispatch с новый фционалом
    Но нужно помнить что (store) расположен не весь Стор, а только фция Диспетч которая передается дальше и этом метод
getState. То-есть это можно заменить на {dispatch, getState}
    getState здесь был бы нужен если вдруг внутри этого Диспетча мы бы захотели получить какое-то текущее значение
стейта и что-то с ним сделать
    Но так как у нас не то и нето не используется то мы можем их убрать и оставить просто ()

    Когда мы подключаем много Middleware одним за другим, то у нас идет цепочка их вызовов. Мы последовательно изменяем
фции Диспетч для того что бы в конце получить такую большую мощную фцию. 
    И когда запускается первый Диспетч те вот здесь dispatch({
            type: action
        }) или вот здесь dispatch(action)
    то на самом деле вместо него будет запущенна АБСОЛЮТНА ВСЯ ФЦИЯ ОТ (action) ДО ПОСЛЕДУЮЩЕГО Middleware
    Продублируем Middleware что бы было понятней
    Когда у нас будет итог первого Middleware, те либо dispatch({
            type: action
        }) или вот здесь dispatch(action)
    То слудующий Middleware который будет запускаться он возьмет вот эту функцию
    (action) => {
    if (typeof action === 'string') {
        return dispatch({
            type: action
        })
    }
        return dispatch(action)
    потому что из него она возвращается
    И запустит вместо вот этой вот части в нашем первом Middleware !!! dispatch({
            type: action
        }) или вот здесь dispatch(action)
    Те вместо тех двух Диспетчей будет вызываться следующая функция и в неё как раз таки будет приходить action из
Второго Middleware потому что у нас либо Объект будет вызываться {type: action} либо Объект который приходит из-вне
dispatch(action). В любом случае во второй Middleware попадает action, который уже что-то будет делать внутри
    По-этому здесь dispatch называется next, и мы это сделаем, просто поменяет dispatch на next
    Потому что вместо next будет вызываться следующая функция из Middleware
    */
const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
}
/* const secondStringMiddleware = () => (dispatch) => (action) => {
    if (typeof action === 'string') {
        return dispatch({
            type: action
        })
    }
    return dispatch(action)
} */

const enhancer = (createStore) => (...args) => {
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
}

/* Теперь нам нужен механизм который будет последовательно всё это делать, то-есть модифицировать наш dispatch
   Для этого импортируе applyMiddleware
   Нам функция compose сейчас вторым аргументом не нужна
   Теперь второй аргумент это applyMiddleware и в него прокидываем ссылку на наш stringMiddleware
   Что бы включить наш window с Девтулс, НЕ получится просто через запятую подставить в applyMiddleware, потому что
включение нашего Девтулса - это не Middleware. Если мы так сделаем то мы увидем ошибку с next
   Что бы решить проблему то воспользуемся compose
   
   ВЫВОД: Middleware это функции по добавляению функционала и изменению работы dispatch 
   Чаще всего они позволяют в качестве action принимать не только Объекты но и строки, фции и тд
   Это не только момент оптимизации, но и создание дополнительно фционала
   Почти никогда их не понадобиться создавать в ручную ! Они почти все уже есть готовые 
   Но теперь мы знаем как они устроены внутри ! 
   */
const store = createStore( 
                    combineReducers({heroes, filters}),
                    compose(applyMiddleware(stringMiddleware),
                    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                    )
                    /* compose(
                        enhancer,
                        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                    ) */
                    );

export default store;
