import React, { useState } from "react";
import "./auth.css"; // Import CSS
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [inputValue, setInputValue] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    isAdmin: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleSubmit = async () => {
    console.log("Signup with", inputValue);
    try {
      const response = await fetch(
        "https://hotelbookingserver-h6pm.onrender.com/auth/signup",
        {
          method: "POST", // Hoặc 'PUT' nếu bạn muốn cập nhật dữ liệu
          headers: {
            "Content-Type": "application/json", // Chỉ định định dạng dữ liệu
          },
          body: JSON.stringify(inputValue), // Chuyển đổi đối tượng dữ liệu thành chuỗi JSON
          credentials: "include", // Nếu cần gửi cookie
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        setErrorMessage(responseData.errorMessage);
        throw new Error("Network response was not ok");
      }

      console.log("Response data:", responseData);
      navigate("/login");
      return responseData;
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  return (
    <div>
      <Navbar />

      <div className="auth-container">
        <div className="auth-form">
          <h2>Sign Up</h2>
          {errorMessage && (
            <div id="formError" class="error">
              {errorMessage}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              id="username"
              value={inputValue.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={inputValue.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={inputValue.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={inputValue.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="number"
              name="phoneNumber"
              id="phoneNumber"
              value={inputValue.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="button" className="btn" onClick={handleSubmit}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
