import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./user-dashboard.css"; 

export function UserDashboard() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/places")
      .then(response => {
        setPlaces(response.data);
      })
      .catch(error => {
        console.error("Error fetching places:", error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">Explore Places</h2>
      <div className="row">
        {places.map((place) => (
          <div key={place.id} className="col-md-4 mb-4">
            <Link
              to={`/placeDetails/${place.id}`}
              style={{ textDecoration: "none", color: "inherit" }}>
              <div className="card shadow-sm h-100">
                {place.images && place.images.length > 0 ? (
                  <img
                    src={place.images[0]}
                    className="card-img-top"
                    alt={place.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="bg-secondary text-white text-center py-5">
                    No Image Available
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{place.name}</h5>
                  <p className="card-text">{place.description}</p>
                  <p className="card-text text-muted">
                    📍 {place.location.city}, {place.location.country}
                  </p>
                   {place.videos && place.videos.length > 0 && (
                      <iframe
                        src={place.videos[0]}
                        width="100%"
                        height="180"
                        frameBorder="0"
                        allowFullScreen
                        title={`Video of ${place.name}`}
                        style={{ borderRadius: "5px" }}
                      />
                    )}

                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
