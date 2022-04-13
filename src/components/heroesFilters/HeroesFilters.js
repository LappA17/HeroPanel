import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import store from '../../store';

import { filtersChanged, fetchFilters, selectAll } from './filtersSlice';
import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {

    /* const filters = selectAll() если бы мы запустили ту команду без аргументов, то будет ошибка
    Объяснение: когда мы заходим в Слайс с героями. Там где мы создавали createSelector - мы передавали эту фцию Вторым Аргументом selectAll. 
    Мы говорили что Стейт прийдет в эту функцию автоматически. Потому что когда мы формируем селектор через createSelector, то его первый
аргумент подставляется автоматически (state) => state.filters.activeFilter, и этот (state) как раз таки и есть наш глобальный стейт
    По-этому когда мы передаем selectAll вторым аргументом на вызов - она автоматически получит этот аргумент
    но когда мы пытаемся здесь const filters = selectAll() вызвать селектАлл без стейта, то будет ошибка ведь наша фция ничего не знает о 
стейте. Да, мы ее настроили так что она пытается вытащить из стейта Фильтры {selectAll} = filtersAdapter.getSelectors(state => state.filters)
но этот стейт она не получает потому что она совершенно ничего об этом не знает
    Что бы решить эту проблему нужно всего лишь импортировать store и вызвать с getState
    store.getState() - здесь мы получим Глобальный Стейт
    selectAll(store.getState()) селекАлл вытащит из него фильтры filtersAdapter.getSelectors(state => state.filters)
    
    Если бы мы в нашем filterSlice создали бы что-то вроде этого
    export const getFilters = selectAll(store.getState()) и уже потом эту готовую конструкцию которая у нас помещается в getFilters
импортировали бы в наши Компоненты, то работать так не будет ! Потому что если мы импортируем сюда Стор еще до того как он был создан, то
мы получим undefined. Потому что наш store формируется из этого Слайса, мы не можем импортировать Стор который был создан до того как мы создали
слайс*/
    const {filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchFilters(request));

        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }

        return arr.map(({name, className, label}) => {

            const btnClass = classNames('btn', className, {
                'active': name === activeFilter
            });
            
            return <button 
                        key={name} 
                        id={name} 
                        className={btnClass}
                        onClick={() => dispatch(filtersChanged(name))}
                        >{label}</button>
        })
    }

    const elements = renderFilters(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;