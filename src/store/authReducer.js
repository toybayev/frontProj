const initialState = {
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  email: localStorage.getItem('resetEmail') || null,
  isAdmin: JSON.parse(localStorage.getItem('user'))?.is_superuser || false, // Проверяем is_superuser
};


export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      case 'SET_USER_DATA':
        localStorage.setItem('user', JSON.stringify(action.payload)); // Сохраняем пользователя
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload,
          isAdmin: action.payload.is_superuser || false,
          accessToken: action.payload.accessToken || state.accessToken,
          refreshToken: action.payload.refreshToken || state.refreshToken,
        };
      
      
    case 'SET_EMAIL':
      localStorage.setItem('resetEmail', action.payload);
      return {
        ...state,
        email: action.payload,
      };
    case 'CLEAR_EMAIL':
      localStorage.removeItem('resetEmail');
      return {
        ...state,
        email: null,
      };
      case 'UPDATE_PROFILE':
        localStorage.setItem('user', JSON.stringify(action.payload));
        return {
          ...state,
          user: action.payload,
        };
    case 'LOGOUT':
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        email: null,
      };
    default:
      return state;
  }
};

// Действие для обновления профиля
export const updateProfile = (userData) => ({
  type: 'UPDATE_PROFILE',
  payload: userData,
});

export const setEmail = (email) => {
  localStorage.setItem('resetEmail', email); // Сохраняем email в localStorage
  return {
    type: 'SET_EMAIL',
    payload: email,
  };
};

export const clearEmail = () => ({
  type: 'CLEAR_EMAIL',
});