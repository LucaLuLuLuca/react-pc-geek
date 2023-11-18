// 1. 判断token是否存在
// 2. 如果存在 直接正常渲染
// 3. 如果不存在 重定向到登录组件

// 高阶组件： 把一个组件当成另一个组件的参数传入
// 然后通过一定的判断 返回新的组件
import { getToken } from "@/utils";
import { Navigate } from "react-router-dom";

function AuthComponent({ children }) {
  const isToken = getToken();
  if (isToken) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
}

// <AuthComponent> <Layout/> </AuthComponent>
// 登陆:<><Layout/></>

// 非登陆：<Navigate to="/login" replace />

export { AuthComponent };
