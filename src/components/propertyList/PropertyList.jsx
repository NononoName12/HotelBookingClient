import "./propertyList.css";
import React, { useState, useEffect } from "react";

const PropertyList = ({ countByType }) => {
  const [hotels, setHotels] = useState();
  const [apartments, setApartments] = useState();
  const [resorts, setResorts] = useState();
  const [villas, setVillas] = useState();
  const [cabins, setCabins] = useState();
  useEffect(() => {
    if (Array.isArray(countByType)) {
      // Kiểm tra nếu countByType là một mảng hợp lệ
      const filteredHotels = countByType.filter((item) => item._id === "hotel");
      setHotels(filteredHotels);
      const filteredApartments = countByType.filter(
        (item) => item._id === "apartments"
      );
      setApartments(filteredApartments);
      const filteredResorts = countByType.filter(
        (item) => item._id === "resorts"
      );
      setResorts(filteredResorts);
      const filteredVillas = countByType.filter(
        (item) => item._id === "villas"
      );
      setVillas(filteredVillas);
      const filteredCabins = countByType.filter(
        (item) => item._id === "cabins"
      );
      setCabins(filteredCabins);
    }
  }, [countByType]); // Mảng rỗng [] đảm bảo effect chỉ chạy khi component mount lần đầu

  return (
    <div className="pList">
      <div className="pListItem">
        <img
          src="https://cf.bstatic.com/xdata/images/xphoto/square300/57584488.webp?k=bf724e4e9b9b75480bbe7fc675460a089ba6414fe4693b83ea3fdd8e938832a6&o="
          alt=""
          className="pListImg"
        />
        {hotels && (
          <div className="pListTitles">
            <h1>Hotels</h1>
            <h2>{hotels[0].count} hotels</h2>
          </div>
        )}
      </div>
      <div className="pListItem">
        <img
          src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg"
          alt=""
          className="pListImg"
        />
        {apartments && (
          <div className="pListTitles">
            <h1>Apartments</h1>
            {apartments[0] ? (
              <h2>{apartments[0].count} apartments</h2>
            ) : (
              <h2>0 apartments</h2>
            )}
          </div>
        )}
      </div>
      <div className="pListItem">
        <img
          src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg"
          alt=""
          className="pListImg"
        />
        {resorts && (
          <div className="pListTitles">
            <h1>Resorts</h1>
            {resorts[0] ? (
              <h2>{resorts[0].count} resorts</h2>
            ) : (
              <h2>0 resorts</h2>
            )}
          </div>
        )}
      </div>
      <div className="pListItem">
        <img
          src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg"
          alt=""
          className="pListImg"
        />
        {villas && (
          <div className="pListTitles">
            <h1>Villas</h1>
            {villas[0] ? <h2>{villas[0].count} villas</h2> : <h2>0 villas</h2>}
          </div>
        )}
      </div>
      <div className="pListItem">
        <img
          src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg"
          alt=""
          className="pListImg"
        />
        {cabins && (
          <div className="pListTitles">
            <h1>Cabins</h1>
            {cabins[0] ? <h2>{cabins[0].count} cabins</h2> : <h2>0 cabins</h2>}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
