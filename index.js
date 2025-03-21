require('dotenv').config()
const { App, } = require('@slack/bolt');
const utils = require("./utils")
const axios = require('axios');
const FormData = require('form-data');
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

(async () => {
    app.shortcut('generate_quote', async ({ ack, body, say, client, respond, shortcut }) => {
        await ack();
        const info = await app.client.users.info({
            user: shortcut.message.user
        })
        const imageBuffer = await utils(body.message.text, info.user.real_name, info.user.profile.display_name);

        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', imageBuffer, 'quote.png');

        try {
            const response = await axios.post('https://catbox.moe/user/api.php', formData, {
                headers: formData.getHeaders(),
            });

            const uploadedImageUrl = response.data; 
            await respond({
                "blocks": [
                    {
                        "type": "image",
                        "image_url": uploadedImageUrl,
                        "alt_text": "Quote image"
                    }
                ]
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            await respond('Failed to upload the image.');
        }
    });

    app.start();
})();

process.on("unhandledRejection", (error) => {
    console.error(error);
});