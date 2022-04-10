/* На данном этапе у нас много повторение кода в Редьюсере
   Импортируем createRedeucer, и что бы его использовать нам понадобиться екшенКрейторы, которые и будут импортированы
в этот Редьюсер. Делается это для того что бы эти функции мы могли подвязывать автоматически к этим Редьюсерам и в
том числе избегать Копипасты, к примеру эти строки 'HEROES_FETCHING' мы написали в файлке actionCreator потом вставили 
сюда в Редьюсер. И что бы этого не делать то мы сразу вставим сюда екшенКрейторы в наш reducer */
import { createReducer } from "@reduxjs/toolkit"

import {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} from '../actions'

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'
}

/* builder - Объект который повзволяет строить, конструировать Редьюсер при помощи Трёх Встроенных Методов 
   Когда мы использует Туллкит то он автоматически использует библиотеку, под названием immer, а она в свою очередь занимается
тем что упрощает работу с Иммутабильностью - это значит что мы можем писать фционал по прямому изменению Стейту, библиотека
внутри сделает всё за нас
    Раньше мы работали с Иммутабильностью так 
    {
        ...state,
        heroesLoadingStatus: 'loading'
    }
    Мы создаем новый Объект, в котором разворачивали внутренности старого Объекта, и меняли в нем одно какое-то свойсвто
    Если бы мы не меняли иммутабильность, то мы могли бы взять какой-то наш Стейт, обратиться к вот этому свойству
heroesLoadingStatus и на прямую изменить его. Именно так мы можем делать когда используем createReducer
    addCase - аналог case из switch case. Он принимает два аргумента: 1) ЕкшенКрейтор. 
    2) Фцию по изменению Стейта - она принимает state и action, те тоже самое что у нас было вот здесь 
const heroes = (state = initialState, action). ЗАМЕТЬ что эта функция ничего не возвращает, она просто запускается
и внутри производит иммутацию, но если мы напишем return или напишем код в одну строчку(что бы код заретернился), то
immer работать не будет, иммер подумает что разработчик сам позаботился о иммутабильность и себя не влкючит !!!

    В heroesFetched у нас уже работа не просто со стейтом но и с Ешкеном
    
    В heroCreated мы писали непростой код heroes: [...state.heroes, action.payload] - мы создавали новый массив, 
разварачивая старый массив и добавляли какой-то новый элемент(action.payload тут у нас лежит один Объект). 
    Но так как мы можем теперь писать ммутабильный код, то в старый массив мы можем просто добавить в конец новый
элемент - для этого воспользуемся push  

    В onDelete, в state.heroes нужно поместить новый Массив, те не нужно создавать новый, а просто оставить все 
элементы без того который был удален

    Если мы прям так сохраним и зайдем на страничку, то будет ошибка, потому что при использование createReducer она 
требует что бы наши команды были созданны при помощи createAction

    Третий метод у builder - это addmatcher - позволяет фильтровать входящий action
    */
/* const heroes = createReducer(initialState, builder => {
    builder //вызываем объект
        .addCase(heroesFetching, state => {
            state.heroesLoadingStatus = 'loading' // библиотека поймет что нужно сделать и будет соблюдать Иммутабильность
        }) 
        .addCase(heroesFetched, (state, action) => {
            state.heroesLoadingStatus = 'idle'
            state.heroes = action.payload
        })
        .addCase(heroesFetchingError, state => {
            state.heroesLoadingStatus =  'error'
        })
        .addCase(heroCreated, (state, action) => {
            state.heroes.push(action.payload)
        })
        .addCase(heroDeleted, (state,action) => {
            state.heroes = state.heroes.filter(item => item.id !== action.payload)
        })
        .addDefaultCase(() => {}) //Это аналог Дефолта. Сюда обычно пишут пустую фцию, она будет вызываться если вдруг
        //не найден action и наш Стейт останется точно таким же 
}) */

/* const heroes = (state = initialState, action) => {
    switch (action.type) {
        case 'HEROES_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading'
            }
        case 'HEROES_FETCHED':
            return {
                ...state,
                heroes: action.payload,
                heroesLoadingStatus: 'idle'
            }
        case 'HEROES_FETCHING_ERROR':
            return {
                ...state,
                heroesLoadingStatus: 'error'
            }
        case 'HERO_CREATED':
            return {
                ...state,
                heroes: [...state.heroes, action.payload]
            }
        case 'HERO_DELETED': 
            return {
                ...state,
                heroes: state.heroes.filter(item => item.id !== action.payload)
            }
        default: return state
    }
} */

/* Так же есть второй вариант работы с createReducer, он работает только с ЖС, с ТайпКриптом работать не будет  
   Вторым аргументом будет Объект вместо builder, где ключами будут actionCreator а их свойства - выполняемые действиеми
   Здесь нужно будет пользоваться фишкой ЕС6 стандарта и будем динамически создавать ключи нашего Объекта
   Выклядит это след образом - мы открываем [] и помещаем туда actionCreator и так как это объект пишем : и туда 
помещаем фцию которая изменяет наш Стейт
   Здесь работает тоже самое правило со словом return или писание кода в одну строчку state => state.heroesLoadingStatus = 'loading'
   Что бы писать в одну строчку можно написать вот так state => {state.heroesLoadingStatus = 'loading'}
   
   В таком формате createReducer имеет три метода - ВТОРОЙ это массив сравнения - он нам не нужен по-этому осталяем
пустой массив []
   Третий - это как раз default, но здесь мы прописываем state => state */
   const heroes = createReducer(initialState, {
    [heroesFetching]: state => {state.heroesLoadingStatus = 'loading'},
    [heroesFetched]: (state, action) => {
                    state.heroesLoadingStatus = 'idle';
                    state.heroes = action.payload;
                },
    [heroesFetchingError]: state => {
                    state.heroesLoadingStatus = 'error';
                },
    [heroCreated]: (state, action) => {
                    state.heroes.push(action.payload);
                },
    [heroDeleted]: (state, action) => {
                    state.heroes = state.heroes.filter(item => item.id !== action.payload);
                }
        },
    [],
    state => state
)
            
export default heroes;