// 先把所有的工具函数导出的模块在这里导入
// 然后再统一倒出
import { http } from "./http";
import { setToken, getToken, removeToken } from "./token";

export { http, setToken, getToken, removeToken };

// 之后引用的时候 import {http} from '@/utils'
