import axios from "axios";

export async function fetchNekolabsAPI(path, parameter = {}, responseType = "json") {
    const baseUrl = "https://api.nekolabs.my.id/";
    try {
        const response = await axios.get(`${baseUrl}${path}`, {
            params: parameter,
            headers: {
                "Content-Type": "application/json",
            },
            responseType,
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from Nekolabs API: ${error.message}`);
        throw error;
    }
}
