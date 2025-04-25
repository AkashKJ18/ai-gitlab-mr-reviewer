const axios = require('axios');

const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
const PROJECT_ID = process.env.GITLAB_PROJECT_ID;
const BASE_URL = `${BASE_URL}/${PROJECT_ID}`;
const headers = { 'Private-Token': GITLAB_TOKEN };

async function getMergeRequestDiff(mrId) {

    const res = await axios.get(`${process.env.BASE_URL}/merge_requests/${mrId}/changes`, { headers });

    return res.data.changes.map(change => ({
        file: change.new_path,
        diff: change.diff
    }));
}

async function postReviewComment(mrId, message) {
    await axios.post(`${BASE_URL}/merge_requests/${mrId}/notes`, {
        body: message
    }, { headers });
}

module.exports = { getMergeRequestDiff, postReviewComment };
