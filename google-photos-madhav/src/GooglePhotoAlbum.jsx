import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Modal from 'react-modal';
import './GooglePhotoAlbum.css';

const CLIENT_ID = '647513903590-oh53gqlgmnm5hd2qevdq21if7u477bbn.apps.googleusercontent.com';
const PAGE_SIZE = 12;

const GooglePhotosAlbum = () => {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [pageToken, setPageToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  const handleLoginSuccess = async (tokenResponse) => {
    const token = tokenResponse.credential;
    setAccessToken(token);
    fetchAlbums(token);
  };

  const handleLoginFailure = (response) => {
    console.error('Login failed: ', response);
  };

  const fetchAlbums = async (token) => {
    try {
      const response = await axios.get(
        'https://photoslibrary.googleapis.com/v1/albums',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            pageSize: 50,
          },
        }
      );
      setAlbums(response.data.albums);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const fetchPhotos = async (albumId = '', nextPageToken = '') => {
    try {
      const response = await axios.get(
        'https://photoslibrary.googleapis.com/v1/mediaItems',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            pageSize: PAGE_SIZE,
            albumId: albumId,
            pageToken: nextPageToken,
          },
        }
      );
      setPhotos(response.data.mediaItems);
      setPageToken(response.data.nextPageToken || '');
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleAlbumChange = (event) => {
    const albumId = event.target.value;
    setSelectedAlbum(albumId);
    fetchPhotos(albumId);
  };

  const openModal = (photo) => {
    setCurrentPhoto(photo);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="google-photos-album">
        {!accessToken ? (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        ) : (
          <>
            <div className="album-selector">
              <label htmlFor="album-select">Select Album:</label>
              <select
                id="album-select"
                value={selectedAlbum}
                onChange={handleAlbumChange}
              >
                <option value="">All Photos</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="photos-grid">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="photo-item"
                  onClick={() => openModal(photo)}
                >
                  <img
                    src={`${photo.baseUrl}=w300-h200`}
                    alt={photo.filename || 'Google Photo'}
                    className="photo"
                  />
                </div>
              ))}
            </div>
            <div className="pagination">
              <button
                onClick={() => fetchPhotos(selectedAlbum, pageToken)}
                disabled={!pageToken}
              >
                Load More
              </button>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
              {currentPhoto && (
                <div className="modal-content">
                  <img
                    src={currentPhoto.baseUrl}
                    alt={currentPhoto.filename || 'Google Photo'}
                    className="modal-photo"
                  />
                  <p>{currentPhoto.filename}</p>
                  <button onClick={closeModal}>Close</button>
                </div>
              )}
            </Modal>
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GooglePhotosAlbum;
