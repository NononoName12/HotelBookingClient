import "./searchItem.css";
import { useNavigate } from "react-router-dom";

const SearchItem = ({
  // name,
  // distance,
  // tag,
  // type,
  // description,
  // free_cancel,
  // price,
  // rate,
  // rate_text,
  // img_url,
  data,
}) => {
  const navigate = useNavigate();
  const handleClick = (id) => {
    console.log(id);
    navigate(`/hotels/${id}`);
  };
  return (
    <div className="searchItem">
      <img src={data.hotel.photos[0]} alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{data.hotel.name}</h1>
        <span className="siDistance">{data.hotel.distance} from center</span>
        {/* <span className="siTaxiOp">{tag}</span> */}
        <span className="siSubtitle">{data.hotel.desc}</span>
        <span className="siFeatures">{data.hotel.type}</span>
        {/* If can cancel
        {free_cancel ? (
          <div>
            <span className="siCancelOp">Free cancellation </span>
            <span className="siCancelOpSubtitle">
              You can cancel later, so lock in this great price today!
            </span>
          </div>
        ) : (
          <div></div>
        )} */}
      </div>
      <div className="siDetails">
        <div className="siRating">
          <span></span>
          <button>{data.hotel.rating}</button>
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">${data.hotel.cheapestPrice}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button
            className="siCheckButton"
            onClick={() => handleClick(data.hotel._id)}
          >
            See availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
