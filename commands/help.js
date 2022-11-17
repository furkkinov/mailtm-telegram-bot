const TelegramBot = require('node-telegram-bot-api');
const bot = require("../bot.js");
module.exports = {
    command: "help",
    run(msg) {
        bot.sendMessage(msg.chat.id, '*Support:* @furkkinov', {
            parse_mode: "Markdown"
        }).then(r => {
            bot.deleteMessage(msg.chat.id, msg.message_id).catch(err => {});
            setTimeout(() => {
                bot.deleteMessage(r.chat.id, r.message_id).catch(err => {});
            }, 30000);
        }).catch(err => {
            console.log(err);
        });
    }
}