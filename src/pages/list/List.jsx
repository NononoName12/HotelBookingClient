import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";

const List = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false); // Sử dụng boolean thay vì chuỗi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [destination, setDestination] = useState(location.state.destination);
  const [date, setDate] = useState(location.state.date);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
  const [inputSearch, setInputSearch] = useState(location.state.dataSearch);
  const [data, setData] = useState([]);
  const [searchTrigger, setSearchTrigger] = useState(false); // Trạng thái để kích hoạt tìm kiếm
  const [errorMessage, setErrorMessage] = useState(null); // Tạo state để lưu thông báo lỗi

  // console.log(inputSearch);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // if (!searchTrigger) return; // Không thực hiện nếu searchTrigger là false

    const postData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const response = await fetch(
          "https://hotelbookingserver-h6pm.onrender.com/hotels/search",
          {
            method: "POST",
            // credentials: "include", // Bao gồm cookie trong yêu cầu
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(inputSearch),
            credentials: "include", // Nếu cần gửi cookie
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            // Nếu nhận được mã lỗi 401, chuyển hướng đến trang login
            navigate("/login"); // Thay đổi đường dẫn đến trang đăng nhập của bạn
          } else {
            // Nếu phản hồi không thành công, nhận thông báo lỗi từ server
            const errorData = await response.json();
            setErrorMessage(errorData.message); // Lưu thông báo lỗi vào state
            setData(false);

            return;
          } // Kết thúc hàm nếu có lỗi
        }

        const jsonData = await response.json();
        setData(jsonData); // Lưu dữ liệu khách sạn vào state nếu không có lỗi
        console.log(jsonData);
        setErrorMessage(null); // Xóa thông báo lỗi nếu có dữ liệu
      } catch (error) {
        console.error("Failed:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    if (location.state.dataSearch) {
      postData(); // Call the postData function
    }
  }, [searchTrigger]); // The effect will run whenever formData changes

  const handleSearch = () => {
    setSearchTrigger((prev) => !prev); // Thay đổi trạng thái để kích hoạt useEffect
    setErrorMessage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Nếu input có type là number, thì parse nó về số, còn không thì giữ nguyên giá trị
    const parsedValue =
      e.target.type === "number" ? parseInt(value, 10) : value;

    setInputSearch((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleDateChange = (item) => {
    setDate([item.selection]);
    setInputSearch({
      ...inputSearch,
      check_in: item.selection.startDate,
      check_out: item.selection.endDate,
    });
  };
  return (
    <div>
      <Navbar user={user} loading={loading} error={error} isLogin={isLogin} />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                name="city"
                value={inputSearch.city}
                type="text"
                onChange={handleChange}
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {`${format(
                  new Date(inputSearch.check_in),
                  "MM/dd/yyyy"
                )} to ${format(new Date(inputSearch.check_out), "MM/dd/yyyy")}`}
              </span>
              {openDate && (
                <DateRange
                  onChange={handleDateChange}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    name="adult"
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={inputSearch.adult}
                    onChange={handleChange}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    name="children"
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    value={inputSearch.children}
                    onChange={handleChange}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    name="room"
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={inputSearch.room}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="listResult">
            {errorMessage && ( // Hiển thị thông báo lỗi nếu có
              <div
                className="error-message"
                style={{
                  color: "red",
                  marginTop: "20%",
                  fontSize: "20px",
                  textAlign: "center",
                }}
              >
                {errorMessage}
              </div>
            )}
            {loading ? (
              <div
                style={{
                  fontSize: "20px",
                  textAlign: "center",
                }}
              >
                Loading data...
              </div>
            ) : (
              data &&
              data.map((item) => {
                return <SearchItem data={item} />;
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;
