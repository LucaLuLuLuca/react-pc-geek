import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import "./index.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { http } from "@/utils";

const { Option } = Select;

const Publish = () => {
  const { channelStore } = useStore();
  // 存放上传图片的列表
  const [fileList, setFileList] = useState([]);
  // 这个函数的执行分阶段 是从updating到done的过程
  // 这个过程只要上传图片内容发生变化就会不断执行直到全部上传完毕
  // 使用useRef 声明一个暂存仓库
  const cacheImgList = useRef([]);
  const onUploadChange = ({ fileList }) => {
    console.log(fileList);
    // 采取受控的手法： 在最后一次log里response
    // 最终react state fileList中存放的数据有response.data.url
    setFileList(fileList);
    // 同时把图片列表存入仓库一份
    // 这里关键位置： 需要做数据格式化
    const formatList = fileList.map((file) => {
      // 上传完毕 做数据处理
      if (file.response) {
        return { url: file.response.data.url };
      }
      // 否则在上传中是 不做处理
      return file;
    });
    cacheImgList.current = formatList;
  };

  //切换图片
  const [imageCount, setImageCount] = useState(1);
  const radioChange = (e) => {
    // 这里的判断依据我们采取原始值 不采取经过useState方法修改之后的数据
    // useState修改后的数据 无法同步获取修改之后的新值
    const rawValue = e.target.value;
    setImageCount(rawValue);
    // 从仓库里面取对应的图片数量 交给我们用来渲染图片列表的fileList
    // 通过调用setFileList
    if (cacheImgList.current.length === 0) {
      return false;
    }
    console.log(imageCount);

    if (rawValue === 1) {
      const img = cacheImgList.current ? cacheImgList.current[0] : [];
      setFileList([img]);
    } else if (rawValue === 3) {
      setFileList(cacheImgList.current);
    }
  };
  //提交表单
  const navigate = useNavigate();
  const onFinish = async (values) => {
    console.log(values);
    //数据二次处理 重点处理cover字段
    const { channel_id, content, title, type } = values;
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map((item) => item.url),
      },
    };
    if (id) {
      await http.put(`/mp/articles/${id}?draft=false`, params);
    } else {
      await http.post("/mp/articles?draft=false", params);
    }
    //跳转列表 提示客户
    navigate("/article");
    message.success(`${id ? "更新成功" : "发布成功"}`);
  };

  // 编辑功能
  // 文案适配 路由参数id 判断条件
  const [params] = useSearchParams();
  const id = params.get("id");
  console.log("rount:", id);
  // 数据回填 id调用接口 1.表单回填 2.暂存列表 3.Upload组件fileList
  const [form] = Form.useForm();
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`);
      const data = res.data;
      // 表单数据回填 实力方法
      form.current.setFieldsValue({ ...data, type: data.cover.type });
      // 调用setFileList 方法回填upload
      const formatImgList = data.cover.images.map((url) => {
        // url => ({url}) 简易写法
        return {
          url: url,
        };
      });
      setFileList(formatImgList);
      // 暂存列表里面也存一份 (暂存列表和fileList回显列表保持数据结构统一就可以)
      cacheImgList.current = formatImgList;
      // 图片type
      setImageCount(data.cover.type);
    };

    // 必须是编辑状态 才可以发送请求
    if (id) {
      loadDetail();
    }
  }, [id, form]);

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? "编辑" : "发布"}文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: "this is content" }}
          onFinish={onFinish}
          ref={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelStore.channelList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>Single Pic</Radio>
                <Radio value={3}>Three Pics</Radio>
                <Radio value={0}>No Pic</Radio>
              </Radio.Group>
            </Form.Item>
            {imageCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                multiple={imageCount > 1}
                maxCount={imageCount}
                onChange={onUploadChange}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          {/* 这里的富文本组件 已经被Form.Item控制 */}
          {/* 它的输入内容 会在onFinished回调中收集起来 */}
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            <ReactQuill theme="snow" className="publish-quill" placeholder="" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {id ? "更新" : "发布"}文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default observer(Publish);
