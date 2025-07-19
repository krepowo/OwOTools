import axios from 'axios';

export async function fetchRyzumiAPI(path, parameter = {}) {
    const baseUrl = 'https://apidl.asepharyana.tech/api';
    try {
        const response = await axios.get(`${baseUrl}${path}`, {
            params: parameter,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from Ryzumi API: ${error.message}`);
        throw error;
    }
}
