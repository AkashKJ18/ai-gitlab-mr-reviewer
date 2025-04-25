require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { getMergeRequestDiff, postReviewComment } = require('./gitlab');
const { generateAIReview } = require('./ai');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const event = req.body;

    if (event.object_kind === 'merge_request' &&
        ['open', 'update'].includes(event.object_attributes.action)) {

        const mrId = event.object_attributes.iid;

        try {
            const diff = await getMergeRequestDiff(mrId);

            const review = await generateAIReview(diff);
            await postReviewComment(mrId, review);
            res.status(200).send('AI review posted.');
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(200).send('Ignored event.');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
