export const fetchData = (url) => {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        });
};
