import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/useAuth";
import Header from "../components/Header";
import VehicleSearch from "../components/vehicle/VehicleSearch";
import API_ENDPOINTS from "../config/api.js";
import Collapsible from "../components/forms/Collapsible";

const Reviews = () => {
  const { authToken } = useAuth();
  const [reviews, setReviews] = useState([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.REVIEWS, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setReviews(data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (isFirstRender.current) {
      fetchReviews();
      isFirstRender.current = false;
    }
  }, [authToken]);

  return (
    <div>
      <Header />
      <VehicleSearch />
      <Collapsible title="Reviews">
        {reviews.map((review) => (
          <div key={review.id}>{review.content}</div>
        ))}
      </Collapsible>
    </div>
  );
};

export default Reviews;
