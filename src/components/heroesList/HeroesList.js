//import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
//import { createSelector } from '@reduxjs/toolkit'; createSelector теперь в слайс

//import { heroDeleted, fetchHeroes, selectAll } from './heroesSlice'; //импортируем selectAll
//import { heroDeleted, fetchHeroes, filteredHeroesSelector } from './heroesSlice'; из-заа RTK Query мы Слайс не используем вообще

/* Теперь будем получать данные и отображать их на странце
   Импортируем Хук для того что бы он служил нам что бы генерировать большое кство свойств которые мы можем использовать */
import {useGetHeroesQuery, useDeleteHeroMutation} from '../../api/apiSlice'

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

const HeroesList = () => {

    /* Создадим Объект, который будет генерироваться при помощи этого Хука
    Здесь возвращается Объект с различными сущностями которые мы можем использовать 
    Самая главная сущность - это данные которые отдаются с сервера
    Всё что мы написали в АпиСлайс служит для того что бы нам получать данные
    Эти данные которые мы получили помещаем в поле data 
    data: heroes - данныее которые мы получим мы запишим в переменную heroes
    Так же у нас есть различные состояния которые мы можем использовать isLoading, isFetching...*/
    const {
        data: heroes = [],
        isFetching,//равен true, когда мы уже делаем последующие запросы, то-есть isLoading срабатывает при ПЕРВОМ, а isFetching последующие
        isLoading,//когда мы ПЕРВЫЙ РАЗ обращаемся к нашему сервера для получения данных. Будет true когда это происходит - грузится какой-то запросс
        isSuccess,//данные загруженны с успехом
        isError,//ошибка при общение с сервером
        error//сама ошибка, которую мы можем вывести
    } = useGetHeroesQuery()
    /* Этот Хук мы вызвали в теле нашего Компонента Функционального. Мы не использовали как здесь useEffect для того что бы отправить запрос.
    useEffect(() => {
        dispatch(fetchHeroes());
        // eslint-disable-next-line
    }, []); Мы не использовали никакие другие Хуки, мы просто взяли и отправили запрос. 
    Когда мы используем такой Хук то нам не useEffect, не useDispatch, не useSelector вообще не нужны
    Здесь все происходит автоматически
    В том числе что запрос у нас будет выполняться уже после Маутинга Компонента, то-есть нам не нужно использовать конструкция где у нас useEffect

    Если мы сейчас зайдём на страничку
    Вместо const elements = renderHeroesList(filteredHeroes) пропишем const elements = renderHeroesList(heroes). Потому что мы уже
получаем данные о героях(которых конечно же нужно еще отфильтроватьпо нашему активнмоу фильтру, но эти данные уже были полученны и мы их можем использовать)
    Мы получим ОШИБКУ. Потому что сейчас у нас создается новый Функциональный Компонент и внутри него мы сразу вызываем наш Хук. 
    Даже не смотря на то что мы не используем useEffect, мы знаем что наш запрос идет и занимает какое-то время, это асинхронная операция, но код
в Компонента выполняется синхроно, те он выполняется-выполняется, доходит до наших героев в renderHeroesList(heroes)(которые на данный 
момент undefined потому что они просто еще не полученны) и здесь появляется ошибка
    Для этого назначим нашим героям значение по умолчанию, скажем что если данные еще не полученны то туда подставяляется пустой массив data: heroes = []
    А во-вторых подсатвим isLoading вместо heroesLoadingStatus === "loading"
    И вместо heroesLoadingStatus === "error" подставим isError
    ТЕПЕРЬ РАБОТАЕТ
    Данные которые мы выводим на страничку, мы получаем НЕ из Стора, это то что нам отдает RTK Query - это наш heroes, который формирует
нашу вёрстку

    Теперь заходим в Redux в панели разработчика и смотрим что у нас происходит в action
    В самом начале у нас регестрируется middleware. Он идет от api/config 
    После этого идет запрос от нашего api
    ТЕ api - это наше новое в нашем Сторе
    
    Важно понимать что в приложение будут параметры, которые будут зависеть от действий пользователя - например выбранный вручную фильтер - это
действие существует только на Фронтенде и это то что делает наш пользователь, это никак не зависет от нашего сервера
    По-этому почти все действия которые у нас совершаются у нас работают с сервером, но часть остается в клиенте(во фронтенде) */

    /* Теперь получим наше активное глобальное состояние и будем использовать внутри нашего Компонента 
    Мы обращаемся к Глобальному Состоянию и говорим что мы из этого Селектора возвращаем state.filters.activeFilter*/
    const activeFilter = useSelector(state => state.filters.activeFilter)

    /*Рас уж активный фильтер у нас получен мы можем взять и создать точно такую же Переменную 
    Заходим в heroesSlice и берём функционал для основы
    Немного ее подкорректируем, именно будем использовать активный фильтер activeFilter

    Так же нужно понимать что если наш Компонент будет перерендериваться то наши данные будут каждый раз фильтроваться при помощи этой функции
    Нужно сделать так что бы для оптимизации если данные не изменились то не нужно заново фильтрацию проводить. По-этому сразу воспользуемся 
Хуком useMemo. Таким образом мы один раз посчитаем, вычеслим каких героем нужно действительно отобразить, а в следующие разы, когда у нас Компонент
действительно будет перерендериваться, то мы будем основываться на тех героев, которые у нас здесь есть - если они поменялись то мы отфильтруем 
еще раз, если нет то так и оставим то значение которое у нас там есть. По-этому оборачиваем все в useMemo, Вторым аргументом ставим список
зависимостей - от чего будет зависить наш useMemo - [heroes] - елси переменная с героями поменяется то весь фционал внутри выполниться заново

    Второй момент - мы бы не хотели внутри функции мутировать наши оригинальные данные, которые пришли от Сервера
    По-этому если здесь есть мутации то лучше создать копию этого элемента и потом будем с ней работать
    const filteredHeroes = heroes.slice() - так мы создадим копию этого массива, мы создаем коппию уже оригинального массива и с ней начинаем
работать 

    Заходим на страничку, пробуем поменять фильтр, но ничего не происходит, так как итоговое значение у нас зависит от heroes, у нас список героев 
не поменялся. 
    По-этому в список зависимостей передаем активный фильтр - если вдруг он поменялся мы что-то будем делать*/
    const filteredHeroes = useMemo(() => {
        const filteredHeroes = heroes.slice()

        if (activeFilter === 'all') {
            return filteredHeroes;
        } else {
            return filteredHeroes.filter(item => item.element === activeFilter);
        }
    }, [heroes, activeFilter])
    /* Важно значть что когда мы делаем запросс на сервер, при помощи RTK Query, то данные Кешируются - они запоминаются на несколько минут, это
позволяте оптимизировать кство запросов, при повторных рендерах Компонентов*/

    /* Будем создавать фцию по удалению, которая будет вызывать нашу мутацию 
    Сейчас эту проблему решает onDelete*/
    const [deleteHero] = useDeleteHeroMutation()

    /*Это уже лишнее
     const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus); */
    //const dispatch = useDispatch();
    /*const {request} = useHttp(); Наш реквест передается как onDelete зависимость, теоритечски наш deleteHero не нужно каждый раз менять
когда меняется запросс по-этому можем оставить пустой массив
    ТЕ фция которая передается в useCallback никогда не будет измененна и нам это вообщем-то не нужно*/

    /* Теперь не получаем героев при помощи этого фционала
    useEffect(() => {
        dispatch(fetchHeroes());
        // eslint-disable-next-line
    }, []); */

    const onDelete = useCallback((id) => {
        deleteHero(id)
        /* request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(data => console.log(data, 'Deleted'))
            .then(dispatch(heroDeleted(id)))
            .catch(err => console.log(err)); */
        // eslint-disable-next-line  
    //}, [request]);
    }, []);

    //if (heroesLoadingStatus === "loading") {
    if (isLoading) {
        return <Spinner/>;
    //} else if (heroesLoadingStatus === "error") {
    } else if (isError) {
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