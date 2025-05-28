import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  MenuOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { GetCurrentUser } from "../api/users";
import { SetUser } from "../redux/userSlice";
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Drawer } from "antd";
import { ShowLoading, HideLoading } from "../redux/loaderSlice";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { Header } = Layout;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleProfileClick = () => {
    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "partner") {
      navigate("/partner");
    } else {
      navigate("/profile");
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  // Get user role display text
  const getUserRoleDisplay = (role) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "partner":
        return "Theatre Partner";
      default:
        return "Customer";
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // User dropdown menu items
  const userMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <ProfileOutlined />,
      onClick: handleProfileClick,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  // Main navigation items
  const navItems = [
    {
      key: "home",
      label: "Home",
      icon: <HomeOutlined />,
      onClick: handleHomeClick,
    },
  ];

  // Mobile navigation items
  const mobileNavItems = [
    {
      key: "home",
      label: "Home",
      icon: <HomeOutlined />,
      onClick: () => {
        handleHomeClick();
        setMobileMenuVisible(false);
      },
    },
    {
      key: "profile",
      label: "My Profile",
      icon: <ProfileOutlined />,
      onClick: () => {
        handleProfileClick();
        setMobileMenuVisible(false);
      },
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        handleLogout();
        setMobileMenuVisible(false);
      },
      danger: true,
    },
  ];

  useEffect(() => {
    const getValidUser = async () => {
      try {
        dispatch(ShowLoading());
        const response = await GetCurrentUser();
        dispatch(HideLoading());
        dispatch(SetUser(response.data));
      } catch (err) {
        dispatch(HideLoading());
        toast.error(err.message || "Authentication failed");
        navigate("/login");
      }
    };

    if (localStorage.getItem("token")) {
      getValidUser();
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return (
    user && (
      <Layout className="protected-layout">
        <Header className="protected-header">
          <div className="header-container">
            {/* Logo */}
            <div className="logo-section" onClick={handleHomeClick}>
              <div className="logo">🎬 BookMyShow</div>
            </div>

            {/* Desktop Navigation */}
            <div className="desktop-nav">
              <Menu
                theme="dark"
                mode="horizontal"
                items={navItems}
                className="nav-menu"
              />

              {/* User Section */}
              <div className="user-section">
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                  overlayClassName="user-dropdown"
                >
                  <div className="user-profile">
                      {user.name} ({getUserRoleDisplay(user.role)})
                    </div>
                </Dropdown>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="mobile-nav">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuVisible(true)}
                className="mobile-menu-btn"
              />
            </div>
          </div>
        </Header>

        {/* Mobile Drawer */}
        <Drawer
          title={
            <div className="mobile-drawer-header">
              {" "}
              <Avatar size="large" className="mobile-user-avatar">
                {getUserInitials(user.name)}
              </Avatar>
              <div className="mobile-user-info">
                <div className="mobile-user-name">{user.name}</div>
                <div className="mobile-user-role">
                  {getUserRoleDisplay(user.role)}
                </div>
              </div>
            </div>
          }
          placement="right"
          open={mobileMenuVisible}
          onClose={() => setMobileMenuVisible(false)}
          className="mobile-drawer"
          width={280}
        >
          <Menu
            mode="vertical"
            items={mobileNavItems}
            className="mobile-menu"
          />
        </Drawer>

        {/* Main Content */}
        <div className="main-content">{children}</div>
      </Layout>
    )
  );
};

export default ProtectedRoute;
