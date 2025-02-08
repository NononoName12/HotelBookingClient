import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Hotel = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy hotelID từ URL
  const [hotel, setHotel] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false); // Sử dụng boolean thay vì chuỗi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://hotelbookingserver-h6pm.onrender.com",
          {
            method: "GET",
            credentials: "include", // Bao gồm cookie trong yêu cầu
          }
        );
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
    const fetchHotelDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://hotelbookingserver-h6pm.onrender.com/hotels/${id}`,
          {
            method: "GET",
            // credentials: "include", // Bao gồm cookie trong yêu cầu
            headers: {
              "Content-Type": "application/json",
            },
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
        setHotel(data);
        console.log(data);
        setErrorMessage(null); // Clear error nếu có dữ liệu
      } catch (error) {
        setErrorMessage("Failed to fetch hotel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails(); // Gọi API để lấy thông tin chi tiết khách sạn
  }, [id]);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber =
        slideNumber === 0 ? hotel.photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === hotel.photos.length - 1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const handleClick = () => {
    navigate("/booking", { state: { hotel } });
  };

  return (
    <div>
      <Navbar user={user} loading={loading} error={error} isLogin={isLogin} />
      <Header type="list" />
      {loading ? (
        <p style={{ fontSize: "20px", textAlign: "center", marginTop: "30px" }}>
          Loading...
        </p>
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <img
                  src={hotel.photos[slideNumber]}
                  alt=""
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          {hotel && (
            <div className="hotelWrapper">
              {/* <button className="bookNow">Reserve or Book Now!</button> */}
              <h1 className="hotelTitle">{hotel.title}</h1>
              <div className="hotelAddress">
                <FontAwesomeIcon icon={faLocationDot} />
                <span>Elton St 125 New york</span>
              </div>
              <span className="hotelDistance">
                Excellent location – {hotel.distance}m from center
              </span>
              <span className="hotelPriceHighlight">
                Book a stay over ${hotel.cheapestPrice} at this property and get
                a free airport taxi
              </span>
              <div className="hotelImages">
                {hotel.photos.map((photo, i) => (
                  <div className="hotelImgWrapper" key={i}>
                    <img
                      onClick={() => handleOpen(i)}
                      src={photo}
                      alt=""
                      className="hotelImg"
                    />
                  </div>
                ))}
              </div>
              <div className="hotelDetails">
                <div className="hotelDetailsTexts">
                  <h1 className="hotelTitle">{hotel.title}</h1>
                  <p className="hotelDesc">{hotel.desc}</p>
                </div>
                <div className="hotelDetailsPrice">
                  <h2>
                    <b>${hotel.cheapestPrice}</b> (1 nights)
                  </h2>
                  <button onClick={handleClick}>Reserve or Book Now!</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <MailList />
      <Footer />
    </div>
  );
};

export default Hotel;
