import "./booking.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateRange } from "react-date-range";
import { format, differenceInDays } from "date-fns"; // Bạn cần cài đặt thư viện date-fns
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [checkDatePicker, setCheckDatePicker] = useState(false); //Kiểm tra xem đã chọn ngày chưa
  const [isLogin, setIsLogin] = useState(false); // Sử dụng boolean thay vì chuỗi
  const [loading, setLoading] = useState(true);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [error, setError] = useState(null);
  const { hotel } = location.state || {}; // Lấy dữ liệu state
  const [rooms, setRooms] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [datesSelected, setDatesSelected] = useState(false); // Trạng thái để kiểm tra ngày đã được chọn
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [dataInput, setDataInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    cardNumber: "",
    paymentMethod: "",
  });

  const [selectedRooms, setSelectedRooms] = useState([]);

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
        // Cập nhật lại form với dữ liệu fetch được
        setDataInput({
          fullName: jsonData.user.fullName || "",
          email: jsonData.user.email || "",
          phoneNumber: jsonData.user.phoneNumber || "",
          cardNumber: "",
          paymentMethod: "",
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (idRoom, number, price) => {
    if (numberOfDays === 0) {
      console.log("Please enter Date");
      return;
    }

    const roomId = idRoom + "/" + number;

    setSelectedRooms((prevSelected) => {
      let updatedSelection = [...prevSelected];

      // Tìm phòng đã tồn tại trong mảng
      const existingRoomIndex = updatedSelection.findIndex(
        (room) => room.idRoom === idRoom
      );

      if (existingRoomIndex !== -1) {
        // Nếu phòng đã tồn tại
        const existingRoom = updatedSelection[existingRoomIndex];
        let numberRoomArr = [...existingRoom.numberRoom];

        if (numberRoomArr.includes(number)) {
          // Nếu số phòng đã tồn tại, xóa nó
          numberRoomArr = numberRoomArr.filter((num) => num !== number);
          // Nếu không còn số phòng nào, xóa phòng khỏi danh sách
          if (numberRoomArr.length === 0) {
            updatedSelection = updatedSelection.filter(
              (room) => room.idRoom !== idRoom
            );
          } else {
            // Cập nhật đối tượng phòng với số phòng đã xóa
            updatedSelection[existingRoomIndex] = {
              ...existingRoom,
              numberRoom: numberRoomArr,
            };
          }
        } else {
          // Nếu số phòng chưa tồn tại, thêm nó vào mảng
          numberRoomArr.push(number);
          updatedSelection[existingRoomIndex] = {
            ...existingRoom,
            numberRoom: numberRoomArr,
          };
        }
      } else {
        // Nếu phòng chưa tồn tại, thêm mới
        updatedSelection.push({
          // idCheckBox: roomId,
          idRoom: idRoom,
          numberRoom: [number], // Mảng chứa số phòng hiện tại
          price,
        });
      }

      return updatedSelection;
    });
  };

  // Hàm onChange dùng để cập nhật dữ liệu trong state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataInput((prevDataInput) => ({
      ...prevDataInput,
      [name]: value,
    }));
  };

  const calculateTotalCost = () => {
    console.log(selectedRooms);
    return Object.values(selectedRooms).reduce(
      (total, { numberRoom, price }) =>
        total + price * numberRoom.length * numberOfDays,
      0
    );
  };

  // Cập nhật số ngày khi ngày thay đổi
  useEffect(() => {
    if (date[0].startDate && date[0].endDate) {
      const days = differenceInDays(date[0].endDate, date[0].startDate);
      setNumberOfDays(days);
      console.log(days);
      setDatesSelected(days > 0); // Ngày đã được chọn nếu số ngày > 0
      if (days > 0) {
        setCheckDatePicker(true);

        const inputCheckRoom = {
          date,
          hotel: hotel._id,
        };
        console.log(inputCheckRoom);
        const fetchCheckRoom = async () => {
          setLoadingRoom(true);
          try {
            const response = await fetch(
              "https://hotelbookingserver-877m.onrender.com/hotels/checkRoomAvailable",
              {
                method: "POST", // Hoặc 'PUT' nếu bạn muốn cập nhật dữ liệu
                headers: {
                  "Content-Type": "application/json", // Chỉ định định dạng dữ liệu
                },
                body: JSON.stringify(inputCheckRoom), // Chuyển đổi đối tượng dữ liệu thành chuỗi JSON
                credentials: "include", // Nếu cần gửi cookie
              }
            );

            const responseData = await response.json();
            // if (!response.ok) {
            //   if (response.status === 401) {
            //     // Nếu nhận được mã lỗi 401, chuyển hướng đến trang login
            //     navigate("/login"); // Thay đổi đường dẫn đến trang đăng nhập của bạn
            //   } else if (response.status === 404) {
            //     alert(responseData.message);
            //   } else {
            //     throw new Error("Network response was not ok");
            //   }
            // }

            console.log("Response data:", responseData.roomData);
            setRooms(responseData.roomData);

            // set lựa chọn phòng về ban đầu
            setSelectedRooms([]);
            // navigate("/transactions");
            // return responseData;
          } catch (error) {
            console.error(
              "There has been a problem with your fetch operation:",
              error
            );
          } finally {
            setLoadingRoom(false);
          }
        };
        fetchCheckRoom();
      }
    } else {
      setDatesSelected(false);
    }
  }, [date]);

  const validate = () => {
    const errors = [];
    let error;
    if (calculateTotalCost() === 0) {
      error = "Please choose Booking time and choose Room!";
      errors.push(error);
    }
    if (dataInput.cardNumber === "") {
      error = "Please enter Card Number!";
      errors.push(error);
    }
    if (dataInput.paymentMethod === "") {
      error = "Please choose Payment Method!";
      errors.push(error);
    }

    if (errors.length > 0) {
      alert(errors[0]);
      return false; // Dừng lại nếu có lỗi
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validate()) {
      console.log(dataInput);
      const inputBooking = {
        hotel: hotel._id,
        reserveInfo: {
          fullName: dataInput.fullName,
          email: dataInput.email,
          phoneNumber: dataInput.phoneNumber,
          cardNumber: dataInput.cardNumber,
        },
        dates: date,
        seclectRooms: selectedRooms,
        totalBill: calculateTotalCost(),
        paymentMethod: dataInput.paymentMethod,
      };
      console.log(inputBooking);
      try {
        const response = await fetch(
          "https://hotelbookingserver-877m.onrender.com/hotels/booking",
          {
            method: "POST", // Hoặc 'PUT' nếu bạn muốn cập nhật dữ liệu
            headers: {
              "Content-Type": "application/json", // Chỉ định định dạng dữ liệu
            },
            body: JSON.stringify(inputBooking), // Chuyển đổi đối tượng dữ liệu thành chuỗi JSON
            credentials: "include", // Nếu cần gửi cookie
          }
        );

        const responseData = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            // Nếu nhận được mã lỗi 401, chuyển hướng đến trang login
            navigate("/login"); // Thay đổi đường dẫn đến trang đăng nhập của bạn
          } else if (response.status === 404) {
            alert(responseData.message);
          } else {
            throw new Error("Network response was not ok");
          }
        }

        console.log("Response data:", responseData);
        navigate("/transactions");
        return responseData;
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    }
  };

  // Hàm handleChange để xử lý thay đổi
  const handleChangeDatePicker = (item) => {
    setDate([item.selection]); // Cập nhật state với giá trị mới
  };
  return (
    <div>
      <Navbar user={user} loading={loading} error={error} isLogin={isLogin} />
      <Header type="list" />
      <div className="hotelContainer">
        <div className="hotelWrapper">
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">{hotel.title}</h1>
              <p className="hotelDesc">{hotel.desc}</p>
            </div>
            <div className="hotelDetailsPrice">
              <h2>
                <b>${hotel.cheapestPrice}</b> (1 nights)
              </h2>
              <button onClick={handleSubmit}>Reserve or Book Now!</button>
            </div>
          </div>
          <div className="inputBooking">
            <div className="dates">
              <h1>Dates</h1>
              <div className="headerSearchItem">
                <span className="headerSearchText">{`${format(
                  date[0].startDate,
                  "MM/dd/yyyy"
                )} to ${format(date[0].endDate, "MM/dd/yyyy")}`}</span>

                <DateRange
                  editableDateInputs={true}
                  onChange={handleChangeDatePicker}
                  moveRangeOnFirstSelection={false}
                  ranges={date}
                  className="dateRange"
                  minDate={new Date()}
                />
              </div>
            </div>
            <div className="reserveInfo">
              <h1>Reserve info</h1>
              <div className="inputInfo">
                <div style={{ marginBottom: "10px" }}>
                  <h2>Your Full Name:</h2>
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="fullName"
                    value={dataInput.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <h2>Your Email:</h2>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={dataInput.email}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <h2>Your Phone Number:</h2>
                  <input
                    type="phone"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    value={dataInput.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <h2>Your Identity Card Number:</h2>
                  <input
                    type="number"
                    placeholder="Card Number"
                    name="cardNumber"
                    value={dataInput.cardNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="seclectRooms">
            <h1>Seclect Rooms</h1>
            {/* {checkDatePicker ? ( */}
            {!loadingRoom ? (
              <div className="containerSeclect">
                {rooms &&
                  // hotel.rooms &&
                  rooms.map((item) => {
                    return (
                      <div className="seclectInput">
                        <div className="infor">
                          <h2>{item.room.title}</h2>
                          <p>{item.room.desc}</p>
                          <p>
                            Max people:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {item.room.maxPeople}
                            </span>
                          </p>
                          <span
                            style={{ fontWeight: "bold", fontSize: "20px" }}
                          >
                            ${item.room.price}
                          </span>
                        </div>
                        <div style={{ display: "flex" }} className="checkbox">
                          {item.roomNumbers &&
                            item.roomNumbers.map((roomNumber) => {
                              return (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginRight: "10px",
                                  }}
                                >
                                  <span>{roomNumber}</span>
                                  <input
                                    type="checkbox"
                                    id={item.room._id}
                                    disabled={!datesSelected} // Vô hiệu hóa checkbox nếu ngày chưa được chọn
                                    onChange={() =>
                                      handleCheckboxChange(
                                        item.room._id,
                                        roomNumber,
                                        item.room.price
                                      )
                                    }
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div style={{ marginBottom: "50px" }}>Loading...</div>
            )}

            <div>
              <h1>Total Bill: ${calculateTotalCost()}</h1>
              <div className="inputTotalBill">
                <div>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    onChange={handleChange}
                  >
                    <option value="">Seclect Payment Method</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>
                <div>
                  <button onClick={handleSubmit}>Reserve Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Booking;
