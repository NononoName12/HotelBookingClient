import "./featuredProperties.css";
import React, { useState, useEffect } from "react";

const FeaturedProperties = ({ top3Hotels, loading, error }) => {
  return (
    <div className="fp">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {top3Hotels &&
        top3Hotels.map((item) => {
          return (
            <div className="fpItem">
              <img src={item.photos[0]} alt="" className="fpImg" />
              <span className="fpName">
                <a href={`/hotels/${item._id}`} target="_blank">
                  {item.name}
                </a>
              </span>
              <span className="fpCity">{item.city}</span>
              <span className="fpPrice">
                Starting from ${item.cheapestPrice}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default FeaturedProperties;
