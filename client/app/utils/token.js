import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export const saveToken = async (token,name) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync('username', name);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const getUser=async()=>{
  return await SecureStore.getItemAsync('username');
}

export const removeUsername = async () => {
  await SecureStore.deleteItemAsync('username');
}

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};
