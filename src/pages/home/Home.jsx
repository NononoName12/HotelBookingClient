import React, { useState, useEffect } from "react";
import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import "./home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false); // Sử dụng boolean thay vì chuỗi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countByRegion, setCountByRegion] = useState(null);
  const [countByType, setCountByType] = useState(null);
  const [top3Hotels, setTop3Hotels] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://hotelbookingserver-877m.onrender.com",
          {
            method: "GET",
            credentials: "include", // Bao gồm cookie trong yêu cầu
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            // Nếu nhận được mã lỗi 401, chuyển hướng đến trang login
            navigate("/login"); // Thay đổi đường dẫn đến trang đăng nhập của bạn
          } else {
            throw new Error("Network response was not ok");
          }
        }

        const jsonData = await response.json();
        console.log("Fetched data:", jsonData); // Kiểm tra dữ liệu
        setUser(jsonData.user);
        setIsLogin(jsonData.isLoggedIn); // Đảm bảo rằng dữ liệu từ API là đúng
        setCountByRegion(jsonData.countByRegion);
        setCountByType(jsonData.countByType);
        setTop3Hotels(jsonData.top3Hotels);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <Navbar user={user} loading={loading} error={error} isLogin={isLogin} />
      <Header />
      <div className="homeContainer">
        <Featured countByRegion={countByRegion} />
        <h1 className="homeTitle">Browse by property type</h1>
        <PropertyList countByType={countByType} />
        <h1 className="homeTitle">Homes guests love</h1>
        <FeaturedProperties
          top3Hotels={top3Hotels}
          loading={loading}
          error={error}
        />
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
