import {
  unstable_HistoryRouter as HistoryRouter,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { history } from "./utils/history";
import Layout from "./pages/Layout";
import Login from "@/pages/Login";
import { AuthComponent } from "./components/AuthComponent";
import Publish from "./pages/Publish";
import Article from "./pages/Article";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    // 路由配置
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          {/* 创建路由path和组件对应关系 */}
          {/* Layout需要鉴权处理 */}
          {/* 这里的Layout不一定不能写死 要根据是否登陆进行判断 */}
          <Route
            path="/"
            element={
              <AuthComponent>
                <Layout />
              </AuthComponent>
            }
          >
            <Route index element={<Home />}></Route>
            <Route path="article" element={<Article />}></Route>
            <Route path="publish" element={<Publish />}></Route>
          </Route>

          {/* 下面这个不需要 */}
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </div>
    </HistoryRouter>
  );
}

export default App;
