import axios from 'axios';

export default {
    // Claims for specific year endpoint
    getClaimsForYear: async (endpoint) => {
        let res = await axios.get(endpoint);
        return JSON.stringify(res.data.claims) || [];
    },

    // Total claims archived endpoint
    getTotalClaimsArchived: async (endpoint) => {
        let res = await axios.get(endpoint);
        return JSON.stringify(res.data.total) || [];
    },
};