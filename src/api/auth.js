import axios from 'axios';

const API_BASE_URL = 'http://209.38.245.158:8001/api/v1';

// Регистрация
export const signUp = async (userData) => {
  const formData = new FormData();
  Object.keys(userData).forEach((key) => {
    formData.append(key, userData[key]);
  });

  const response = await axios.post(`${API_BASE_URL}/auth/sign-up/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Логин
export const login = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login/`, credentials, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data; // Возвращает access и refresh токены
};

// Обновление токена
export const refreshToken = async () => {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) {
    throw new Error('No refresh token found');
  }

  const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh });
  localStorage.setItem('accessToken', response.data.access); // Обновляем access токен
  return response.data.access;
};

// Подтверждение кода
export const verifyCode = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/auth/verify-email/`, data);
  return response.data;
};

// Выход (Logout)
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};


// Отправка email для сброса пароля
export const sendResetPasswordCode = async (email) => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/send-reset-password-code/`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json', // Убедитесь, что только этот заголовок передаётся
        },
      }
    );
    return response.data;
  };
  
  
  

// Проверка кода сброса пароля
export const checkResetPasswordCode = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/auth/check-reset-password-code/`, data);
    return response.data;
};

// Сброс пароля
export const resetPassword = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password/`, data);
    return response.data;
};

// Получение данных пользователя
export const getUserData = async () => {
    const token = localStorage.getItem('accessToken'); // Получаем токен
    if (!token) throw new Error('No access token found');
  
    const response = await axios.get(`${API_BASE_URL}/auth/get-profile-info`, {
      headers: {
        Authorization: `JWT ${token}`, // Передаём токен в заголовке
      },
    });
    console.log(response.data)
  
    return response.data; // Возвращаем данные пользователя
};
  
// Обновление данных профиля
export const updateProfileInfo = async (formData) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');
  
    const response = await axios.post(`${API_BASE_URL}/auth/update-profile-info`, formData, {
      headers: {
        Authorization: `JWT ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  
    return response.data;
  };
  