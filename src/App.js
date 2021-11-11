import React, { useState, useEffect, useRef } from 'react'
import './App.css';

const BASE_URL = 'https://picsum.photos';

function App() {

  const [images, setImages] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const ref = useRef(null);
  const PAGE_LIMIT = 10;

  const fetchImages = async (pageNumber) => {
		const response = await fetch(
			`${BASE_URL}/v2/list/?page=${pageNumber}&limit=${PAGE_LIMIT}`
		);
		const data = await response.json();
		setImages((photo) => [...photo, ...data]);
	};

  const loadMore = () => {
    setPageNumber(prevPage => prevPage + 1);
  }

  useEffect(() => {
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 1.0
		};
		const observer = new IntersectionObserver((entries) => {
			const [entry] = entries;
			if(entry.isIntersecting) {
        loadMore();
        if (pageNumber >= 5) {
          observer.unobserve(ref.current);
				}
      }
		}, options);
    observer.observe(ref.current);
	}, []);



  useEffect(() => {
		fetchImages(pageNumber);
    console.log(images);
	}, [pageNumber]);



  return (
		<div className="App">
			<h1>Infinite Scroll</h1>
			<div className="image-container">
				{images.map((image, index) => (
					<div className="thumbnail" key={index}>
						<img src={`${BASE_URL}/id/${image.id}/550/420`} alt={image.title} />
					</div>
				))}
			</div>
			<h3 className="center">Total images {images.length}</h3>
			<div className="btn-container" ref={ref}>
				<button className="load-btn" onClick={loadMore}>
					Load More
				</button>
			</div>
		</div>
	);
}

export default App;
