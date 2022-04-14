import {useHttp} from '../../hooks/http.hook';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import store from '../../store';

import { selectAll } from '../heroesFilters/filtersSlice';
//import { heroCreated } from '../heroesList/heroesSlice'; RTK Query заменил

import { useCreateHeroMutation } from '../../api/apiSlice';
/* Здесь будет тоже свойя особенность, ведь когда мы задавали просто запрос, у нас Хук возвращал набор каких-то данных - все потому что у нас запрос
отправлялся самостоятельно, мы никак его негде не вызвали
   Когда мы вызываем Хук с Мутацией, то нам нужно его как-то запустить, нам нужен какой-то триггер, например отправка формы, когда мы отправляем
форму то у нас происходит мутация как и на сервере так и в Глобальных Данных. Вот здесь мы как раз проводили такие операции
request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(res => console.log(res, 'Отправка успешна'))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err))
Мы делали запрос на сервер и меняли что-то в нашем Глобальном Стейте dispatch(heroCreated(newHero))
    По-этому весь этот функционал мы можем заменить на одну команду, которую мы должны сначада получить*/

const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState('');
    const [heroDescr, setHeroDescr] = useState('');
    const [heroElement, setHeroElement] = useState('');

    /* Получаем эту команду 
    useCreateHeroMutation после срабатываения этот Хук возвращает нам Массив из двух данных
    1) Фция которая будет вызывать мутацию
    2) Объект с Данными о состояние запроса(isLoading, isFetching и прочее), но нам понадобитсья только isLoading*/
    const [createHero, {isLoading}] = useCreateHeroMutation()

    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();
    const {request} = useHttp();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescr,
            element: heroElement
        }

        /* Передаем нового героя который конструируется как newHero как аргумент этой фции
        То-есть тот герой который был передан он приходит вот в эту функцию в нашем apiSlice и отправляется как body
        query: hero => ({
                url: '/heroes',
                method: 'POST',
                body: hero
            })
        Так же можем вызвать unwrap для того что бы все фукнции в нашем Втором Объекте useCreateHeroMutation они правильно отрабатывали   */
        createHero(newHero).unwrap()
        /*Заходим на сервер и пробуем создать героя - ничего не получилось. 
        Разбираемся - action у нас идут от api и при том у нас это какая-то Мутация, сначало она запустилась(был статус пендинг) и потом завершилась
успешно с статусом fullfield
        Но сейчас у нас нет никакого механизма для того что бы связывать вот эти вот запроссы с обновлением нашего текущего стейта, что бы у нас
автоматически появлялся какой-то герой. 
        Но у нас вообще даже какого-то Стейта даже нет, потому что у нас в Стейте все данные которые хранятся от героев они хранятся в третей
сущности в api, мы в героях уже ничего не делаем. Чуть позже нам стейт с героями будет уже не нужен
        ЗДЕСЬ БУДЕТ ОДНА ИЗ САМЫХ СЛОЖНЫХ ЧАСТЕЙ, КОТОРАЯ ВЫГЛЯДИТ ПРОСТО КАК МАГИЯ, МЫ СДЕЛАЕМ ТАК ЧТО БЫ ПОСЛЕ КАЖДОГО 
    ЗАПРОССА НА МУТАЦИЮ, У НАС УХОДИЛ ЗАПРОСС НА ПОЛУЧЕНИЕ АКТУАЛЬНЫХ ДАННЫХ - те мы мутировали сразу после этого получили от сервера
    какие-то актуальные данные, что бы у нас была постоянно связь между клиентом и сервером 
        Для этого мы можем указать связи между endpoint при помощи Тегов
        создадим в apiSlice свойство tagTypes*/

        /* Не нужен потому что есть useCreateHeroMutation
        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(res => console.log(res, 'Отправка успешна'))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err)); */

        setHeroName('');
        setHeroDescr('');
        setHeroElement('');
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }
        
        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={heroDescr}
                    onChange={(e) => setHeroDescr(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={heroElement}
                    onChange={(e) => setHeroElement(e.target.value)}>
                    <option value="">Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;