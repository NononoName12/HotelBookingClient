import React, { useState, useEffect } from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ loading, error, isLogin, user }) => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleTrasactions = () => {
    navigate("/transactions", { state: { user: user, isLogin: isLogin } });
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://hotelbookingserver-h6pm.onrender.com/auth/logout",
        {
          method: "POST",
          credentials: "include", // Đảm bảo gửi cookie nếu cần
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.message);
      } else {
        // Xử lý sau khi logout thành công
        window.location.href = "/login"; // Chuyển hướng đến trang login hoặc trang khác
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="navbar">
      <div className="navContainer">
        <span className="logo" onClick={handleHome}>
          Booking Website
        </span>
        <div className="navItems">
          {isLogin ? (
            <>
              <h3>{user?.email}</h3>
              <button className="navButton" onClick={handleTrasactions}>
                Transactions
              </button>
              <button className="navButton" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="navButton" onClick={handleSignup}>
                Signup
              </button>
              <button className="navButton" onClick={handleLogin}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
