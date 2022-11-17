const TelegramBot = require('node-telegram-bot-api');
const bot = require("../bot.js");
const Mailjs = require("@cemalgnlts/mailjs");
const randomWords = require('random-words');
const JSONdb = require('simple-json-db');
const db = new JSONdb('accounts.json');
const mailjs = new Mailjs();
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports = {
    command: "create_email",
    async run(query) {
        let allow = true;
        let name = "", domain = "", password = "";
        await mailjs.getDomains().then(res => {
            domain = res.data[0].domain;
        }).catch(err => {
            console.log(err);
            bot.answerCallbackQuery(query.id, {
                text: '❌ Failed to get domains',
                show_alert: true
            }).catch(err => {});
            allow = false;
            return;
        });
        if(!allow) return;
        randomWords({exactly: 2}).forEach(w => {
            name = name + w;
        });
        name = name + getRandomInt(100, 99999);
        randomWords({exactly: 3}).forEach(w => {
            password = password + w.charAt(0).toUpperCase() + w.slice(1);
        });
        password = password + getRandomInt(100, 99999);
        mailjs.register(`${name}@${domain}`, password).then(r => {
            db.set(query.message.chat.id, {
                email: `${name}@${domain}`,
                password
            });
            db.sync();
            bot.editMessageText(`*Logged as*\nEmail: \`${name}@${domain}\`\nPassword: \`${password}\``, {
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
        }).catch(err => {
            console.log(err);
            bot.answerCallbackQuery(query.id, {
                text: '❌ Failed to register email',
                show_alert: true
            }).catch(err => {});
        })
    }
}