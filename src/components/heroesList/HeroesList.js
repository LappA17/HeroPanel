import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import { createSelector } from 'reselect';

import { heroesFetching, heroesFetched, heroesFetchingError, heroDeleted } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

const HeroesList = () => {

    /* Мы получаем этих героев return state.heroes из стейта с героями логично
   А эти state.activeFilter с фильтрами 
   Мы из это фции будем возвращать Объект
   Мы получаем Объект который содержит данные из двух разных Редьюсеров
   Но при таком способе Компонент будет при каждом изменение перерисовываться, потому что в Хуке идет строгое сравнение
потому что мы Объект в someState строго сравниваем с Объектом который был до этого
    Этот вариант очень НЕ ОПТИМИЗИРОВАН И ЕГО ЛУЧШЕ НИКОГДА НЕ ИСПОЛЬЗОВАТЬ*/
    /* const someState = useSelector(state => ({
        activeFilter: state.filters.activeFilter,
        heroes: state.heroes.heroes
    })) 
    
    Решить проблему можно вот так вот state.filters.activeFilter , state.heroes.heroes
    Но у такого кода могут быть просадки при оптимизации 
    Впишем console.log('render')
    И теперь после каждого нажатие на фильтер - идет перерендеринг
    То-есть при изменение глобального стейта - у нас вызывается useSelector
    Но у нас как была строка all так и осталась state.filters.activeFilter === 'all' но приложение отслеживает
что у нас какой-то триггер был и он у нас поменялся, даже не смотря что знаечние внутри точно такое же, именно по этому
useSelector у нас срабатывает каждый раз и каждый раз он формирует новый список героев 

    ЧТО БЫ РЕШИТЬ ПРОБЛЕМУ у нас есть фция createSelector которая будет мемоизировать значение - запоминать его
    Прописываем npm i reselect --save
    Пишем import { createSelector } from 'reselect';
    
    Мы будем создавать новый Селектор
    Наша Первая Фция получает в себя стейт - наше глобально состояние и будет возвращать активный фильтер из фильтров
    (state) => state.filters.activeFilter
    То-есть результатом первой фции будет получение из стейта текущий активный фильтр
    Вторая Функция будет получать Геров
    Потом берём то что пришло из Первой и Второй фции
    ТЕПЕРЬ МЕНЯЕМ state.filters.activeFilter НА ПРОСТО filter
    А state.heroes.heroes НА heroes

    Как итог в filteredHeroesSelector мы получили ФУНКЦИЮ-СЕЛЕКТОР - так называются функции которые получают кусочек
нашего стейта
    const filteredHeroes = useSelector(filteredHeroesSelector) формируем список готовый героев

    Теперь при тесте на страничке у нас нет перернедринг при клике на all, это значит что у нас при помощи
createSelector была мемоизация, теперь фция знает что если у нас одно и тоже значение внутри фильтра то она не будет 
вызываться просто так
 */
    const filteredHeroesSelector = createSelector(
        (state) => state.filters.activeFilter,
        (state) => state.heroes.heroes,
        (filter, heroes) => {
            if (filter === 'all') {
                console.log('render');
                return heroes;
            } else {
                return heroes.filter(item => item.element === filter);
            }
        }
    );

    /* Мы можем заниматься фильтрацией на получение файлов с нашего Стора
    Но мы не как не задействовали фцию Селектор, а именно она отвеат за получение каких-то данных
    Будем заниматься фильтрацией именно здесь что именно если у нас списко героев стоит как all те все то мы не будем
их фильтровать
    Если первое условие выполняется то мы сюда filteredHeroes получаем стейт всех загруженных героев
    И раз эта переменная у нас использовалась только в одном файлике,то мы можем теперь спокойно почистить reducer
    */
    /* const filteredHeroes = useSelector(state => {
        if (state.filters.activeFilter === 'all') {
            console.log('render')
            return state.heroes.heroes
        } else {
            return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter) Мы из Стейта 
            вытягиваем список геров, потом начинаем его фильтровать и если элемент который перебирается(item) его 
            фильтер совпадает с активным фильтром, то в таком случае он попадает в новый массив
        }
    }) */

    const filteredHeroes = useSelector(filteredHeroesSelector)

    const {heroesLoadingStatus} = useSelector(state => state);
    //const {filteredHeroes ,heroesLoadingStatus} = useSelector(state => state);

    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))

        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => {
        // Удаление персонажа по его id
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(data => console.log(data, 'Deleted'))
            .then(dispatch(heroDeleted(id)))
            .catch(err => console.log(err));
        // eslint-disable-next-line  
    }, [request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    timeout={0}
                    classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition 
                    key={id}
                    timeout={500}
                    classNames="hero">
                    <HeroesListItem  {...props} onDelete={() => onDelete(id)}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;