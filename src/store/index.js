// 把所有的模块做统一处理
// 倒出一个统一的方法 useStore

import React from "react";
import LoginStore from "./login.Store";
import UserStore from "./user.Store";
import ChannelStore from "./channel.Store";

class RootStore {
  constructor() {
    this.loginStore = new LoginStore();
    this.userStore = new UserStore();
    this.channelStore = new ChannelStore();
    //...
  }
}

// 实例化root
// 倒出useStore context

const rootStore = new RootStore();
const context = React.createContext(rootStore);
// 注入context

const useStore = () => React.useContext(context);
export { useStore };
