import React, { useState } from "react";
import { Button, Flex, Form, Input, Typography, notification } from "antd";
import "./login.css";
// import { apiLogin } from "../../services/authService";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    // try {
    //   setLoading(true);
    //   const response = await apiLogin(values);
    //   if (response.status < 300) {
    //     const user = JSON.stringify(response.data);
    //     localStorage.setItem("user", user);
    //     navigate("/farmers");
    //     window.location.href = "/farmers";
    //     setLoading(false);
    //   } else {
    //     setLoading(false);
    //     api["error"]({
    //       message: "Error",
    //       description: response?.data?.data?.message,
    //     });
    //   }
    // } catch (err) {
    //   setLoading(false);
    //   api["error"]({
    //     message: "Error",
    //     description: err.message,
    //   });
    // }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="appBg">
      {contextHolder}
      <div className="loginForm">
        <Flex align="center" justify="center">
          <Typography.Title>
            <img src='/images/logo.png' width={100} />
          </Typography.Title>
        </Flex>
        <Form
          name="basic"
          initialValues={{
            username: "",
            password: "",
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            className="formItem"
            name="username"
            rules={[
              {
                required: true,
                message: "Required",
              },
            ]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            className="formItem"
            name="password"
            rules={[
              {
                required: true,
                message: "Required",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="btn"
            loading={loading}
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
