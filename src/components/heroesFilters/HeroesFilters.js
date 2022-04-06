import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { filtersFetching, filtersFetched, filtersFetchingError, activeFilterChanged } from '../../actions';
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active

/* У нас есть Фильтры которые загружаются с Сервера
   Мы на базе этих Фильтров формируем кусочек вёрстки, там где return <button
   В Фильтрах в JSON мы создали массив объектов, и теперь каждый Фильтер вклюает не только его название, но и label -
те как его нужно подписать и cssКласс который нужно с ним использовать. И эти данные мы используем что бы строить
новые кнопки
    В наш Общей Глобальный Стор мы вели такое поле как активный Фильтер activeFilter: 'all' - это тот фильтер который
на данный момент в приложение у нас применяется. Изначально у нак показываются все персонажи, но этот фильтер может
меняться взависимости на какую кнопку нажал пользователь
    onClick={() => dispatch(activeFilterChanged(name))} Здесь при клике диспетчиться новое действие-изменениеАктивногоФильтра
И сюда мы передаем имя этого активного фильтра: name: fire, water и тд
    Когда этот фильтер меняется - он попадает в actionCreator - activeFilterChanged
    Но самое главное происходит в reducer
     */

const HeroesFilters = () => {

    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    // Запрос на сервер для получения фильтров и последовательной смены состояния
    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))

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

        // Данные в json-файле я расширил классами и текстом
        return arr.map(({name, className, label}) => {

            // Используем библиотеку classnames и формируем классы динамически
            const btnClass = classNames('btn', className, {
                'active': name === activeFilter
            });
            
            return <button 
                        key={name} 
                        id={name} 
                        className={btnClass}
                        onClick={() => dispatch(activeFilterChanged(name))}
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