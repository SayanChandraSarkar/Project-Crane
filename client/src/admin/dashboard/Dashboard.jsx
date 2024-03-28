import { useState } from "react";
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
// import { Link, Route, Routes } from "react-router-dom";
import { DashboardContent } from "./content/DashboardContent";
import { Content2 } from "./content/Content2";
const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  let contentComponent;
  switch (selectedMenuItem) {
    case "dashboard":
      contentComponent = <DashboardContent />;
      break;
    case "content2":
      contentComponent = <Content2 />;
      break;

    default:
      contentComponent = null;
      break;
  }

  return (
    <>
      <Layout className="h-[100vh]">
        <Sider trigger={null} theme="light" collapsible collapsed={collapsed}>
          <img src="/images/logo.png" className="m-auto mt-2 p-2" />
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            onClick={({ key }) => setSelectedMenuItem(key)}
          >
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="content2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {contentComponent}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;
