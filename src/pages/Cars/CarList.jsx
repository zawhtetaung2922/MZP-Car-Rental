import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllCars } from "../../api/fetchAllCars"; // Adjust path as needed
import axiosInstance from "../../api/axios"; // Adjust path as needed
import "./CarList.css";
import FilterCar from "./FilterCar";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [carImages, setCarImages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchAllCars();
        setCars(data);

        // Fetch images for cars
        const images = await Promise.all(
          data.map(async (car) => {
            try {
              const response = await axiosInstance.get(`/view/cars/${car.id}/image`, {
                responseType: "blob",
              });
              return { id: car.id, imageUrl: URL.createObjectURL(response.data) };
            } catch {
              return { id: car.id, imageUrl: "https://via.placeholder.com/150" };
            }
          })
        );

        // Map images to their car IDs
        const imageMap = images.reduce((acc, { id, imageUrl }) => {
          acc[id] = imageUrl;
          return acc;
        }, {});
        setCarImages(imageMap);
      } catch (err) {
        setError("Failed to load cars");
      }
    };
    loadCars();
  }, []);

  const totalPages = Math.ceil(cars.length / itemsPerPage);
  const currentCars = cars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <FilterCar />
      <div className="car-list">
        <h1>Car List</h1>
        {error && <p className="error-message">{error}</p>}
        {cars.length === 0 ? (
          <p>No cars available at the moment</p>
        ) : (
          <>
            <div className="car-cards">
              {currentCars.map((car) => (
                <div
                  key={car.id}
                  className="car-card"
                  onClick={() => navigate(`/cars/${car.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={carImages[car.id] || "https://via.placeholder.com/150"}
                    alt={`${car.brand || "Unknown"} ${car.model || "Unknown"}`}
                    className="car-image"
                  />
                  <div className="car-info">
                    <h3>
                      {car.brand || "Unknown Make"} {car.model || "Unknown Model"}
                    </h3>
                    <p>Year: {car.year || "N/A"}</p>
                    <p>Price: ${car.pricePerDay || "Contact for price"}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CarList;
