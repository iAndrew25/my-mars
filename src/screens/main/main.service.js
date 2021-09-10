import {useState, useEffect} from 'react';

const API_KEY = 'VuTvEDJkGmCmHTDh7XMjf2z8FsZkXgI62sfe7upf';
const URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=10&api_key=${API_KEY}`;

const useFetch = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [data, setData] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const response = await (await fetch(URL)).json();

				setData(response.photos);
				setIsLoading(false);
			} catch(error) {
				setIsLoading(false);
				setError('We were not able to retrive the photos.\nPlease try again later.')
			}
		})()
	}, [])

	return {isLoading, error, data};
};

export {useFetch};