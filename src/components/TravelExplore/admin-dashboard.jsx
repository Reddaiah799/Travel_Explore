import { useState, useEffect } from "react";
import axios from "axios";
import './admin-dashboard.css';

// ✅ Base URL for your deployed JSON server on Render
const API_BASE_URL = "https://travel-explore-api-data.onrender.com";

export function AdminDashboard() {
    // --- State Declarations ---
    const [places, setPlaces] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        description: '',
        images: '',
        videos: '',
        city: '',
        country: '',
    });
    const [editing, setEditing] = useState(false);

    // --- Fetch Places ---
    const fetchPlaces = () => {
        axios.get(`${API_BASE_URL}/places`)
            .then(response => setPlaces(response.data))
            .catch(error => {
                console.error("Failed to fetch places:", error);
                alert("Unable to fetch data from server.");
            });
    };

    // --- On Component Mount ---
    useEffect(() => {
        fetchPlaces();
    }, []);

    // --- Form Input Handling ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Reset Form ---
    const resetform = () => {
        setFormData({
            id: null,
            name: '',
            description: '',
            images: '',
            videos: '',
            city: '',
            country: ''
        });
        setEditing(false);
    };

    // --- Edit Handler ---
    const handleEdit = (place) => {
        setFormData({
            id: place.id,
            name: place.name,
            description: place.description,
            images: place.images.join(", "),
            videos: place.videos.join(", "),
            city: place.location.city,
            country: place.location.country
        });
        setEditing(true);
    };

    // --- Delete Handler ---
    const handleDelete = (id) => {
        if (window.confirm("Are you really sure you want to delete this place?")) {
            axios.delete(`${API_BASE_URL}/places/${id}`)
                .then(() => {
                    alert("Place deleted!");
                    fetchPlaces();
                })
                .catch(() => alert("Failed to delete place"));
        }
    };

    // --- Submit Handler ---
    const handleSubmit = (e) => {
        e.preventDefault();

        const Payload = {
            name: formData.name,
            description: formData.description,
            images: formData.images ? formData.images.split(",").map(i => i.trim()).filter(i => i) : [],
            videos: formData.videos ? formData.videos.split(",").map(i => i.trim()).filter(i => i) : [],
            location: {
                city: formData.city,
                country: formData.country
            }
        };

        if (editing) {
            axios.put(`${API_BASE_URL}/places/${formData.id}`, Payload)
                .then(() => {
                    alert('Place updated!');
                    fetchPlaces();
                    resetform();
                })
                .catch(() => alert('Failed to update the place'));
        } else {
            axios.post(`${API_BASE_URL}/places`, Payload)
                .then(() => {
                    alert('Place added!');
                    fetchPlaces();
                    resetform();
                })
                .catch(() => alert('Failed to add place'));
        }
    };

    return (
        <div className="banner">
            <div style={{ padding: 25 }}>
                <h2>Admin Dashboard - Manage The Places</h2>

                <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
                    <input
                        name="name"
                        placeholder="Place Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ display: "block", marginBottom: 10 }}
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        style={{ display: "block", marginBottom: 10, width: "300px" }}
                    />
                    <input
                        name="images"
                        placeholder="Images URLs (comma-separated)"
                        value={formData.images}
                        onChange={handleChange}
                        style={{ display: "block", marginBottom: 10, width: "300px" }}
                    />
                    <input
                        name="videos"
                        placeholder="Video URLs (comma-separated)"
                        value={formData.videos}
                        onChange={handleChange}
                        style={{ display: "block", marginBottom: 10, width: "300px" }}
                    />
                    <input
                        name="city"
                        placeholder="Enter the City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        style={{ display: "block", marginBottom: 10 }}
                    />
                    <input
                        name="country"
                        placeholder="Enter the Country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        style={{ display: "block", marginBottom: 10 }}
                    />
                    <button type="submit" className="btn btn-success">
                        {editing ? "Update Place" : "Add Place"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger mx-2"
                        onClick={resetform}
                    >
                        Cancel
                    </button>
                </form>

                <h3>Existing Places</h3>
                {places.length === 0 ? (
                    <p>No places added yet.</p>
                ) : (
                    <ul>
                        {places.map((place) => (
                            <li key={place.id} style={{ marginBottom: 10 }}>
                                <strong>{place.name}</strong> ({place.location.city}, {place.location.country})
                                <button onClick={() => handleEdit(place)} style={{ marginLeft: 10 }}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(place.id)} style={{ marginLeft: 5 }}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
