import "./featured.css";

const Featured = ({ countByRegion }) => {
  return (
    <div className="featured">
      <div className="featuredItem">
        <img
          src={`${process.env.PUBLIC_URL}/images/HaNoi.jpg`}
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Ha Noi</h1>
          {countByRegion && <h2>{countByRegion["Ha Noi"]} properties</h2>}
        </div>
      </div>

      <div className="featuredItem">
        <img
          src={`${process.env.PUBLIC_URL}/images/HCM.jpg`}
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Ho Chi Minh</h1>
          {countByRegion && <h2>{countByRegion["Ho Chi Minh"]} properties</h2>}
        </div>
      </div>
      <div className="featuredItem">
        <img
          src={`${process.env.PUBLIC_URL}/images/DaNang.jpg`}
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Da Nang</h1>
          {countByRegion && <h2>{countByRegion["Da Nang"]} properties</h2>}
        </div>
      </div>
    </div>
  );
};

export default Featured;
