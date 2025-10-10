import { useState, useEffect } from "react";
import axios from "axios";
import './admin-dashboard.css'
export function AdminDashboard() {
    // --- State Declarations ---
    const [places, setPlaces] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        description: '',
        images: 0,
        videos: '', 
        city: '',
        country: '',
    });
    const [editing, setEditing] = useState(false);

    // --- Data Fetching ---
    const fetchPlaces = () => {
        axios.get("http://localhost:3000/places")
            .then(response => setPlaces(response.data))
    };
    useEffect(() => {
        fetchPlaces();
    }, []);
    const resetform = () => {
        setFormData({
            id: null,
            name: '',
            description: '',
            images: 0,
            videos: '',
            city: '',
            country: ''
        });
        setEditing(false); // Reset editing flag
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
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
    const handleDelete = (id) => {
        if (window.confirm("Are you really sure you want to delete this place?")) {
            axios.delete(`http://localhost:3000/places/${id}`)
                .then(() => {
                    alert("Place is Deleted 😒");
                    fetchPlaces();
                })
                .catch(() => alert("Failed to delete place"));
        }
    };
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
            axios.put(`http://localhost:3000/places/${formData.id}`, Payload)
                .then(() => {
                    alert('Place updated!');
                    fetchPlaces();
                    resetform();
                })
                .catch(() => alert('Failed to update the place'));
        }
        else {
            axios.post("http://localhost:3000/places", Payload)
                .then(() => {
                    alert('Place added!');
                    fetchPlaces();
                    resetform();
                })
                .catch(() => alert('Failed to add places'))
        }
    };
    return (
        <div className="banner">
        <div style={{ padding: 25 }}>
            <h2>Admin DashBoard - Manage The Places</h2>
            
            <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
                <input name="name" placeholder="Place Name" value={formData.name} onChange={handleChange} required style={{ display: "block", marginBottom: 10 }} />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required rows={3} style={{ display: "block", marginBottom: 10, width: "300px" }} />
                <input name="images" placeholder="Images URLs (comma-separated)" value={formData.images} onChange={handleChange} style={{ display: "block", marginBottom: 10, width: "300px" }} />
                <input name="videos" placeholder="Video URLs (comma-separated)" value={formData.videos} onChange={handleChange} style={{ display: "block", marginBottom: 10, width: "300px" }} />
                <input name="city" placeholder=" Enter the City" value={formData.city} onChange={handleChange} required style={{ display: "block", marginBottom: 10 }} />
                <input name="country" placeholder=" Enter the Country" value={formData.country} onChange={handleChange} required style={{ display: "block", marginBottom: 10 }} />
                <button type="submit" className="btn btn-success bi bi-heart"> {editing ? "Update Place" : "Add Place"}</button>
                <button type="button" className="btn btn-danger bi bi-heartbreak mx-2" onClick={resetform}>Cancel</button>
            </form>
            <h3>Existing places</h3>
            {places.length === 0 && <p>No places added yet here.</p>}
            <ul> 
                {places.map(place => (
                    <li key={place.id} style={{ marginBottom: 10 }}>
                        <strong>{place.name}</strong> ({place.location.city}, {place.location.country})
                        <button onClick={() => handleEdit(place)} style={{ marginLeft: 10 }}>Edit</button>
                        <button onClick={() => handleDelete(place.id)} style={{ marginLeft: 5 }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
}