/* У нашей RTK Query есть две функции которые нам нужно импортировать createAPI, fetchBaseQuery
   Мы их импортируем из кусочка query/react*/
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

/* Теперь будем создавать функциональность по работе с сервером 
   В createApi помещаем во внутрь Объект
   Так как мы создаем сейчас срез(Слайс) - это будет кусочек какого-то фционала, который будет включаться в Стор, по-этому первая настройка будет
reducerPath и дальшу указываем строку 'api' - апи это по факту настройка нашего reducer то-есть все наши данные будут помещены в store.api

    baseQuery - фкция которая будет делать запрос. Здесь нужно бы написать fetch с каким-то адрессом, но у нас уже есть fetchBaseQuery, которую
мы будем использовать
    fetchBaseQuery - имеет настройки внутри себя, которые мы можем указывать и менять
    baseUrl - настройки нашего Фетча, а именно куда мы будем делать запросы по умолчанию
    endpoints - те опперации, которые мы будем проводить по базовому адрессу: получение данных, отправка данных, удаление, обновление. Здесь будет
два типа действий: 
    1) query - запроссы которые получают данные и сохраняют их
    2) mutaiton - запроссы на изменение данных на Сервера
    builder - автоматический аргумент нашей endpoints. Эта фция builder должна вернуть Объект. В это объекте нужно описать какие-то действия
Пока что базовое действие - это получение наших героев getHeroes. Ставим : так как это Объект, и так как мы здесь просто запрашиваем данные ! 
то-есть без какого либо их изменения, а просто хотим их получить, то мы используем метод query !!
    метод query тоже нужно настроить потому что мы пока не знаем куда нужно обращаться для того что бы получить героев 
    query: () => '/heroes' - мы указываем куда мы будем делать запросс */
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3001'}),

    /* Благодаря Тегу мы скажем что какая-то функция будет работать конкретно с этими данными
    1)Создаем Тег 'Heroes'
    2)Следующим этапом мы говорим что если мы запрашиваем данные, то к какому Тегу эти данные относятся - providesTags. ТЕ когда мы получили
данные то к какому тегду они будут относится и передаем его в getHeroes после query
    3)Указываем что если происходит мутация, то в каких данных это происходит, тоже по Тегу. ТЕ что именно загрузить повторно, когда данные
изменились invalidatesTags: ['Heroes'] в наш createHero после query
    ИТОГО: мы добавили ТРИ сущности. 1) - какие у нас сущуствуют Метки в нашем апи. 2) - когда данные запрашиваются при помощи query, при
помощи обычного запросса, к какой метки это относится 3) - мы в мутации сказали что если вдруг мы мутировали эти данные, то по какой метки мы 
должны получить эти актуальные данные
    И вот после того как мы создали эти Теги и их подвязали, то герой создается. Из-за того что мы опперации связали тегами - они могут выполняться
последовательно, показывая актуальное положение дел на сервере
    Смотрим в панеле разработчика. Сначала мы получили всех героев, потом после нажатия на кнопочку отправить - произошшла сначала мутация, она 
отправилоась, потом она успешно завершилась и сразу после этого у нас автоматически отправился запросс на получение данных
*/
    tagTypes: ['Heroes'],
    endpoints: builder => ({
        getHeroes: builder.query({
            query: () => '/heroes',
            providesTags: ['Heroes']
        }),
        /* Теперь создадим еще один endpoin - конкретное дейсвтие которое мы будем выполнять, это уже будет МУТАЦИЕЙ. То-есть в первом случае
мы создавали именно запрос, а сейчас будет именно ИЗМЕНЕНИЕ ДАННЫХ НА СЕРВЕРЕ - МУТАЦИЯ 
    В hero мы должны настроить что будет происходить
    url передаем что бы понимать где эту мутация проводить
    method - когда будет вызываться Хук, нужно понимать какой метод вообще использовать 
    body - то что нужно отправить на сервер, туда передаем ту сущность которая к нам и приходит в качестве аргумента 
    body - автоматически будет привращен в JSON формат
    Теперь генерим новый хук в Экспорт. Обрати внимание что так как эта мутация то и в хуке по правильному называем Mutation
    Переходим в Компонент создания персонажа*/
        createHero: builder.mutation({
            query: hero => ({
                url: '/heroes',
                method: 'POST',
                body: hero
            }),
            invalidatesTags: ['Heroes']
        }),

        /* Теперь добавим удаление героев
        builder.mutation - потому что мы действительно изменяем данные на сервере 
        в url передаем путь и в путь id героя который будет удаляться
        invalidatesTags: ['Heroes'] - подязываем наше удаление под запросс*/
        deleteHero: builder.mutation({
            query: id => ({
                url: `/heroes/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Heroes']
        })
    })
})
/* Вот здесь начинается самое интересное ! Команда createApi будет автоматически генерировать Хуки на каждое наше действие !!! 
   Эти действие которые мы описываем называются endPointami, то-есть getHeroes - это наш ЕндПоинт
   К конце к название Хука у нас присоединяется Тип Ендпоинта, либо мутация, либо запрос */

   /* У нас apiSlice - это Объект
   Мы будем вытаскивать из Объекта Хук useGetHeroes и так как у нас это просто запрос, то мы добавляем Query
   Помимо Хука который будет делать запроссы, мы должны добавить наш АПИ(createApi) в наш главный Стор, что бы там его зарегестрировать
   Наш createApi создает нам еще и reducer, который будет в нашем стейте формировать вот это вот свойство reducerPath: 'api' 
   Заходим в Стор и импортриурем его туда*/
export const {useGetHeroesQuery, useCreateHeroMutation, useDeleteHeroMutation} = apiSlice

/* Можем спокойно удалить heroesSlice */

/* ПОДВЕДЁМ БОЛЬШОЙ ИТОГ:
    Теперь если внимательно посмотреть на наш код, то мы обнаружим что глобального состояния с героями у нас вообще нет
    Теперь мы начинаем думать не изменениями глобального состояния, а опперированием загруженных данных, при этом мы всегда держим их актуализированными,
ведь мы на прямую общаемся с сервером и держим все данные именно там, а в браузере данные содержаться в кешированном формате, когда RTK держит их
в своей памяти. Теперь данных которые были в обычном Стейте - просто нет. Они находятся в api - queries - getHeroes - data
    ИНОГДА ПОЛЬЗОВАТЕЛЬ ВЗАИМОДЕЙСТВУЕТ КАК-ТО С ФРОНТЕНДОМ, например как в нашем случае фильтрирует героя, по-этому полностью от
Глобального Состояние избавиться очень сложно, всегда будут выбранные пользователем фильтры или что-то интерактивное, но работу с сервером мы можем
сбросить на эту библиотеку */