const initialState = {
    courses: [],
    filteredCourses: [],
    loading: false,
    error: null,
    selectedCourse: null, // Новый параметр
  };
  
  export const coursesReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_COURSES_REQUEST':
        return { ...state, loading: true, error: null };
      case 'FETCH_COURSES_SUCCESS':
        return {
          ...state,
          loading: false,
          courses: action.payload,
          filteredCourses: action.payload,
        };
      case 'FETCH_COURSES_FAILURE':
        return { ...state, loading: false, error: action.payload };
      case 'FETCH_COURSE_DETAIL_SUCCESS': // Новый action
        return { ...state, selectedCourse: action.payload, loading: false };
      case 'FETCH_COURSE_DETAIL_FAILURE': // Обработка ошибки
        return { ...state, selectedCourse: null, error: action.payload };
      default:
        return state;
    }
  };
  