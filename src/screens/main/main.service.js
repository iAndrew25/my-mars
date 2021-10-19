import { useState, useEffect } from 'react';
import {api_key} from '../../config/api_keys.json';

const URL = `https://api.pexels.com/v1/search?query=nature`;

const useFetch = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [data, setData] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const response = await (await fetch(URL, {
					headers: {
						Authorization: api_key
					}
				})).json();

				setData(response.photos);
				setIsLoading(false);
			} catch (_error) {
				setIsLoading(false);
				setError('We were not able to retrive the photos.\nPlease try again later.');
			}
		})();
	}, []);

	return { isLoading, error, data };
};

export { useFetch };
