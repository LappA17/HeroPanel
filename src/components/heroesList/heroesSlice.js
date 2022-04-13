/* В конце уркоа Ваня сказал что наши Селекторы в больших проектах могут сильно разростаться и правильным тонном будет хранить Селекторы
в отдельных местах */
import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';
/* heroesAdapter - вернёт Объект, у которого будут готовые методы, коллбеки, мемоизированные селекторы(селеткоры это функции, которые позволяют
вытащить кусочек Стора)
    Адаптер обычно передается в качеств начального значение при создание нашего slice  */
const heroesAdapter = createEntityAdapter()

/* У нашего heroesAdapter есть метод getInitialState - таким образом мы сможем сгенерировать наше новое начальное состояние
    Важно ! Когда мы используем адаптор - наша структура немножко меняется, теперь у нас НЕ такая структура
    const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'
} А  мы получим вот это если выведим в консоль 
    Object
    entities: {}
    ids: []
    В getInitialState мы можем добавить свойство которые мы хотим добавить к нашему изначальному Стейту, для этого откроем Объект
    Наши heroes: [] будут находится в entities */
const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle'
})
//console.log(initialState)

/* const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'
} */


export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    async () => {
        const {request} = useHttp()
        return await request("http://localhost:3001/heroes")
    }
)

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    /* Так как герой у нас будет создаваться(добавлять) один - мы можем воспользоваться addOne - добавляет одну сущность. 
    Здесь будут сравниваться id и если такой герой с таким id уже есть то он не будет добавлен
    Первый аргумент - стейт, второй аргумент та сущность которую мы хотим добавить
    В addOne первый аргумент приходит стейт с которым будем работать, второй аргумент в качестве полезной нагрзуки
    addOne добавляет одну сущность
    
    В removeOne как action.payload приходит уникальный индификатор того что мы хотим удалить. 
    action.paylod приходит вторым аргументом потому что мы удаляем одного персонажа. Библиотека получает id, находит по нем эту сущность и 
просто удаляет из нашего стейта*/
    reducers: {
        heroCreated: (state, action) => {
            //state.heroes.push(action.payload);
            heroesAdapter.addOne(state, action.payload)
        },
        heroDeleted: (state, action) => {
            //state.heroes = state.heroes.filter(item => item.id !== action.payload);
            heroesAdapter.removeOne(state, action.payload)
        }
    },
    /* У аддаптера есть очень много методов
    В нашем случае подойдет именно setAll для того что бы установить новые данные, причем в множественно количесте и вместо state.heroes = action.payload
    setAll - принимает в себя МАССИВ новых сущностей или Объект и заменяет то что было до этого ! 
    В setAll нужно передать два аргумента, 1) state - куда будем помещать эти данные 2) action.payload - то что будет заменять старые 
данные на новые. 
    Эта команда дословно будет означать что во время того как наш запрос выполнился, мы получили данные, мы воспользуемся готовый функционалом
из нашего адаптера heroesAdapter и мы возьмем наш state, который возьмет наш стейт с героями и добавит в них всё что пришло от сервера
те наш action.payload 
    Заходим на страничку и в Redux
    У нас есть стейт с нашими героями - heroes(тоже самое что и state.heroes) 
    Дальше идет та же структура что и в initialState - у нас есть статус который тоже поменялся с heroesLoadingStatus = 'loading' поменялся
на heroesLoadingStatus = 'idle' 
    В нашем heroes находится Объект с уникальными индификаторами - ids и entities - сущности
    ids - это Объект свойствами которого будут цифрами, а значениями - те id которые мы получиили с сервера. Те если мы сейчас создадим нового
перса то сюда добавиться новое свойство и значение !
    entities - те данные которые мы получаем от сервера. Это тоже Объект, его свойства - это уникальные индификаторы(то что мы получили
от сервера), а значение - те данные которые есть в каждем нашем герои в виде Объекта(то-есть у нас Объект в Объекте)
    entities: {
        1: {данные персонажа}
        2: {данные персонажа}
    }
    В HeroesList вот здесь (state) => state.heroes.heroes мы пытаемся получить список всех этиъ сущностей, но здесь нам приходит массив,
с которым мы потом как-то взаимодействуем. Мы бы могли написаить (state) => state.heroes.entities - то здесь мы получаем все равно Объект,
а с Объектом нужно уже по другом взаимодействовать, потому что тот Массив который был здесь до этого мы передавали в функцию Рендера и этот массив
мы там обрабатываем вот здесь const renderHeroesList = (arr)
     */
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                //state.heroes = action.payload;
                heroesAdapter.setAll(state, action.payload)
            })
            .addCase(fetchHeroes.rejected, state => {
                state.heroesLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = heroesSlice;

export default reducer;

/* Нам нужно вместо (state) => state.heroes.enteties получить обратно массив как это было раньше 
    В нашем Адапторе есть функция getSelectors, у нее есть много параметров которая она может получать ! 
    state => state.heroes - мы говорим что наши Селекторы будут четко привязаны к Героям. Теперь все Селекторы(все функции которые у нас там
есть с документации будут обращаться сразу к героям)  
    Так как нам нужно получать список наших сущностей мы будем использовать команду только selectAll вытаскивая ее из Объекта
*/
//export const {selectAll} = heroesAdapter.getSelectors(state => state.heroes)
const {selectAll} = heroesAdapter.getSelectors(state => state.heroes)//так как селектор теперь в Слайс, то больше не экспортируем

export const filteredHeroesSelector = createSelector(
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
);

export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;