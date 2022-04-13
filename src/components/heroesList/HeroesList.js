import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
//import { createSelector } from '@reduxjs/toolkit'; createSelector теперь в слайс

//import { heroDeleted, fetchHeroes, selectAll } from './heroesSlice'; //импортируем selectAll
import { heroDeleted, fetchHeroes, filteredHeroesSelector } from './heroesSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

const HeroesList = () => {

    /* (state) => state.heroes.entities - здесь мы просто передавали функцию, функция которая просто получает автоматически аргумент Стейта
и она что-то возвращает. Мы эту функцию создавали вручную. Но так как у нас теперь есть selectAll которая была создана заранее разработчиками
то мы просто передаем эту функцю
    selectAll так же получит наш стейт и вернет массив с данными(с героями) который нам нужен
    Теперь немного вспомним как работает createSelector. selectAll - наша вторая функция, которая возвращает наших героев(именно массив). 
И так как наша третяя функция у нас заключительная (filter, heroes) => , она берет первый аргумент filter(который мы получаем из state.filters.activeFilter)
И второй аргумент - heroes который мы получает из функции selectAll 
    
    Теперь наши отфильтрованные герои const filteredHeroes = useSelector(filteredHeroesSelector), именна эта переменная filteredHeroes
спокойно передается вот в эту функцию renderHeroesList(filteredHeroes). Эта функция ожидает что у нас будет массив и он перебирается с 
помощью map 

    Переносим весь этот Селектор в Слайс*/
    /* const filteredHeroesSelector = createSelector(
        (state) => state.filters.activeFilter,
        //(state) => state.heroes.entities(было heroes)
        selectAll,
        (filter, heroes) => {
            if (filter === 'all') {
                return heroes;
            } else {
                return heroes.filter(item => item.element === filter);
            }
        }
    ); */

    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes());
        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => {
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