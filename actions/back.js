const bot = require("../bot.js");
module.exports = {
    command: "back",
    run(query) {
        bot.editMessageText('*Welcome to Mail.tm telegram bot*\n\n/register \`<address> <password>\` - Create email\n/login \`<address> <password>\` - Login to email', {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: 'Create random email', callback_data: 'create_email' }]
                ]
            }),
            "message_id": query.message.message_id,
            "chat_id": query.message.chat.id,
            parse_mode: "Markdown"
        }).catch(err => {});
    }
}