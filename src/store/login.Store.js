// login module
import { makeAutoObservable } from "mobx";
import { http, setToken, getToken, removeToken } from "@/utils";

class LoginStore {
  token = getToken() || "";
  // 初始化。取到就用本地的，刷新不丢失。取不到就空串。
  constructor() {
    //响应式
    makeAutoObservable(this);
  }
  getToken = async ({ mobile, code }) => {
    // 调用登陆接口
    const res = await http.post("http://geek.itheima.net/v1_0/authorizations", {
      mobile,
      code,
    });
    // 存入token （存在内存）

    this.token = res.data.token;

    // 存入localStorage
    setToken(this.token);
  };
  //退出登陆
  loginOut = () => {
    this.token = "";
    removeToken();
  };
}
export default LoginStore;
