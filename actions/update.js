const TelegramBot = require('node-telegram-bot-api');
const bot = require("../bot.js");
const JSONdb = require('simple-json-db');
module.exports = {
    command: "update",
    run(query) {
        let db = new JSONdb('accounts.json');
        if(!db.get(query.message.chat.id)) {
            bot.answerCallbackQuery(query.id, {
                text: '❌ No Email found for your account',
                show_alert: true
            }).catch(err => {});
            return;
        }
        let acc = db.get(query.message.chat.id);
        bot.answerCallbackQuery(query.id).catch(err => {});
        bot.editMessageText(`*Logged as*\nEmail: \`${acc.email}\`\nPassword: \`${acc.password}\``, {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id,
            parse_mode: 'Markdown',
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: 'Logout', callback_data: 'back' }],
                    [{ text: 'Check new messages', callback_data: 'check' }],
                    [{ text: 'Update', callback_data: 'update' }]
                ]
            })
        }).catch(err => {});
    }
}