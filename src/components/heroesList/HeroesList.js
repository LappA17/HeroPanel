import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import { createSelector } from 'reselect';

/* Так как мы создали новый Екшен fetchHeroes то три сущности из них уже не используются
   Они включены в один ЕкшенКрейтор который делает все за нас */
//import { heroesFetching, heroesFetched, heroesFetchingError, heroDeleted } from '../../actions';
import { fetchHeroes, heroDeleted } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

const HeroesList = () => {

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

    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    // Подставим вместо строки функцию без вызова
    /* То-есть мы в фцию диспетч передали actionCreator на прямую без вызова и все работает - это значит что наш thunk 
работает и подключен к нашему проекту
    
    Теперь представим что у нас стоит задача что бы фильтеры переключались с зардержкой, те мы нажимаем на кнопку 
переключения фильтра и через секунду только переключается
    Можно было бы нашу кнопку с обработчиком событий обернуть в СетТаймаут onClick={() => dispatch(activeFilterChanged(name))}
    Но так будет не красиво и хотелось бы сделать более централизовано
    Заходим в action и находит тот екшенКрейтор который нам нужен - это activeFilterChanged. Здесь мы будем менять наш
фильтр и должны сделать с какой-то задержкой
    
    Когда с СетТаймаут разобрались, то видим что у нас есть действие по получению данных с сервера
    Он неплохо работает, но этот участок кода для получения списков геров нужно будетКопипастить из Компонента в 
Компонент + повторение dispatch в этих местах
    Для этой задачи мы можем создать actionCreator в виде функции
    
    Теперь мы очень сильно сократили код и передаем в наш екшен fetchHeroes только request так как он приходит из-вне
с нашего Хука !!! 
    Теперь нас не интересует что передается в диспетч, Объект или фция , главное что все правильно отрабатывается
    В целом - это одна из главных задач Thunk - передавать фцию которая потом будет делать что-то асинхроно
    
*/
    useEffect(() => {
        dispatch(fetchHeroes(request))
        // eslint-disable-next-line
    }, [])
    /* useEffect(() => {
        //dispatch(heroesFetching());
        //dispatch("HEROES_FETCHING")
        dispatch(heroesFetching)
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))

        // eslint-disable-next-line
    }, []); */

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