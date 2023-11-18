import { Card, Form, Input, Checkbox, Button, message } from "antd";
import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";

// 导入样式文件
import "./index.scss";
import { useStore } from "@/store";

function Login() {
  const { loginStore } = useStore();
  const navigate = useNavigate();
  async function onFinish(values) {
    //跳转和提示用户，要在异步ok之后才触发。
    //这段代码是在尝试使用提供的用户输入进行登录，并在登录成功后导航到主页面。如果登录失败，会显示一个错误消息
    // const { mobile, code } = values;
    // try {
    //   await loginStore.login({ mobile, code });
    //   navigate("/");
    // } catch (e) {
    //   message.error(e.response?.data?.message || "登录失败");
    // }
    // console.log(values);
    // values：放置的是所有表单项中用户输入的内容
    // todo：登陆
    await loginStore.getToken({
      mobile: values.username,
      code: values.password,
    });
    // 跳转首页
    navigate("/", { replace: true });
    // 提示用户
    message.success("登陆成功");
  }
  function onFinishFailed(errorInfo) {
    console.log("Failed:", errorInfo);
  }
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        {/* 子项用到的触发事件 需要在Form中都声明一下才可以 */}
        <Form
          validateTrigger={["onBlur", "onChange"]}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "请输入手机号!",
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "请输入正确的手机号",
                validateTrigger: "onBlur",
              },
            ]}
          >
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "请输入验证码!",
              },
              { len: 6, message: "请输入6位密码", validateTrigger: "onBlur" },
            ]}
          >
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
