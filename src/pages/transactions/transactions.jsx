import { useEffect, useState } from "react";
import React from "react";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import List from "../list/List";
import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

import "./transactions.css";

const Transactions = () => {
  // const location = useLocation();
  // const state = location.state || {};
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // Sử dụng boolean thay vì chuỗi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000", {
          method: "GET",
          credentials: "include", // Bao gồm cookie trong yêu cầu
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        console.log("Fetched data:", jsonData); // Kiểm tra dữ liệu
        setUser(jsonData.user);
        setIsLogin(jsonData.isLoggedIn); // Đảm bảo rằng dữ liệu từ API là đúng
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/hotels/transactions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: user.username,
            }),
            credentials: "include", // Nếu cần gửi cookie
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            // Nếu nhận được mã lỗi 401, chuyển hướng đến trang login
            navigate("/login"); // Thay đổi đường dẫn đến trang đăng nhập của bạn
          } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message);
            return;
          }
        }

        const data = await response.json();
        setTransactions(data);
        console.log(data);
        setErrorMessage(null); // Clear error nếu có dữ liệu
      } catch (error) {
        setErrorMessage("Failed to fetch transactions.");
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchTransactions(); // Gọi API để lấy thông tin chi tiết khách sạn
  }, [user]);

  return (
    <div>
      <Navbar user={user} loading={loading} error={error} isLogin={isLogin} />
      <Header type={"list"} />
      <div className="homeContainer">
        <div className="booking-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Hotel</th>
                <th>Room</th>
                <th>Date</th>
                <th>Price</th>
                <th>Payment Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions &&
                transactions.map((item, index) => {
                  let backgroundColor;

                  switch (item.status) {
                    case "Booked":
                      backgroundColor = "red";
                      break;
                    case "Checkin":
                      backgroundColor = "green";
                      break;
                    case "Checkout":
                      backgroundColor = "gray";
                      break;
                    default:
                      backgroundColor = "transparent"; // Default color if status doesn't match
                  }

                  return (
                    <tr key={item._id}>
                      <td>{(index + 1).toString().padStart(2, "0")}</td>
                      <td>{item.hotel.name}</td>
                      {item.room && (
                        <td>
                          {item.room
                            .flatMap((room) => room.numberRoom) // Lấy tất cả số phòng từ từng room
                            .join(", ")}{" "}
                        </td>
                      )}
                      <td>
                        {item.dateStart} - {item.dateEnd}
                      </td>
                      <td>${item.price}</td>
                      <td>{item.payment}</td>
                      <td>
                        <span
                          style={{
                            backgroundColor,
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
