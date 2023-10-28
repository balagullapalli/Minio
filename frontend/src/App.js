import React, { useState} from "react";
import axios from "axios";

function App() {
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // useEffect(() => {
  //   fetchPhotos();
  // }, []);

  const fetchPhotos = async () => {
    try {
      // Make a GET request to retrieve photos from the Flask server
      const response = await axios.get("http://localhost:5000/photos"); // Replace with your Flask server URL
      setPhotos(response.data.photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      // Make a POST request to upload a photo to the Flask server
      await axios.post("http://localhost:5000/upload", formData); // Replace with your Flask server URL

      // Clear the selected file and refresh the photo list
      setSelectedFile(null);
      fetchPhotos();
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  return (
    <div>
      <h1>Photo App</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <h2>Photos</h2>
      <ul>
        {photos.map((photo, index) => (
          <li key={index}>{photo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
