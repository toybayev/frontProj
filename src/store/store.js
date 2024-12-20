import { createStore, combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { coursesReducer } from './coursesReduser';

// Комбинируем редьюсеры
const rootReducer = combineReducers({
  auth: authReducer,
  courses: coursesReducer,
});

// Создаём Store
const store = createStore(rootReducer);

export default store;
