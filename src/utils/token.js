// 封装localStorage 存取token

// 封装一个函数，记住写返回值。

const key = "pc-key";

const setToken = (token) => {
  return window.localStorage.setItem(key, token);
};

const getToken = () => {
  return window.localStorage.getItem(key);
};

const removeToken = () => {
  return window.localStorage.removeItem(key);
};

export { setToken, getToken, removeToken };
