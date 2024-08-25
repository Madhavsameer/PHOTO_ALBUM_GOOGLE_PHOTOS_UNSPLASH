import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './PhotoAlbum.css'; // We'll add some CSS here

const UNSPLASH_API_URL = 'https://api.unsplash.com/photos';
const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos';
const ACCESS_KEY = 'zGI2GQaieIC56gkctTeyC-J6-S3a4eMfvsijLNhLxpQ';

const PhotoAlbum = () => {
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, [page, query]);

  const fetchPhotos = async () => {
    const url = query ? UNSPLASH_SEARCH_URL : UNSPLASH_API_URL;
    const params = query ? { query, page, per_page: 12 } : { page, per_page: 12 };

    try {
      const response = await axios.get(url, {
        params,
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      });
      setPhotos(query ? response.data.results : response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPhotos();
  };

  const openModal = (photo) => {
    setCurrentPhoto(photo);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="photo-album">
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search photos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="photos-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-item" onClick={() => openModal(photo)}>
            <img
              src={photo.urls.small}
              alt={photo.description || 'Unsplash Image'}
              className="photo"
            />
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((prevPage) => prevPage + 1)}>Next</button>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Photo Modal">
        {currentPhoto && (
          <div className="modal-content">
            <img
              src={currentPhoto.urls.regular}
              alt={currentPhoto.description || 'Unsplash Image'}
            />
            <p>{currentPhoto.description || 'No Description'}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PhotoAlbum;
