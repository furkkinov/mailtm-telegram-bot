const bot = require("../bot.js");
const JSONdb = require('simple-json-db');
const axios = require("axios");
module.exports = {
    command: "check",
    async run(query) {
        let db = new JSONdb('accounts.json');
        if(!db.get(query.message.chat.id)) {
            bot.answerCallbackQuery(query.id, {
                text: '❌ No Email found for your account',
                show_alert: true
            }).catch(err => {});
            return;
        }
        let acc = db.get(query.message.chat.id);
        axios.post("https://api.mail.tm/token", { address: acc.email, password: acc.password }).then(token => {
            token = token.data.token;
            token = token.replace("\r\n", "");
            let ab = token;
            axios.get("https://api.mail.tm/messages", { headers: { Authorization: "Bearer " + token } }).then(r => {
                if (r.data["hydra:member"].length == 0) {
                    bot.answerCallbackQuery(query.id, {
                        text: '🤔 No messages found',
                        show_alert: true
                    }).catch(err => {});
                } else {
                    bot.answerCallbackQuery(query.id).catch(err => {});
                    let d = r.data["hydra:member"];
                    let c = 0;
                    let a = setInterval(async() => {
                        if(d[c]) {
                            let m = d[c];
                            c++;
                            await bot.sendMessage(query.message.chat.id, `*${m.subject}*\nFrom: \`${m.from.address}\`\nDate: \`${m.createdAt}\``, {
                                parse_mode: 'Markdown',
                                reply_markup: JSON.stringify({
                                    inline_keyboard: [
                                        [{ text: 'View', web_app: {url: "https://merchant.furkkinov.top/mailtm?token=" + Buffer.from(ab).toString("base64") + "&message=" + Buffer.from(m.id).toString("base64")} }],
                                        [{ text: 'Remove', callback_data: 'delete' }]
                                    ]
                                })
                            });
                        } else {
                            clearInterval(a);
                        }
                    }, 100);
                }
            }).catch(err => {
                console.log(err);
                bot.answerCallbackQuery(query.id, {
                    text: '❌ Failed to get messages',
                    show_alert: true
                }).catch(err => {});
            })
        }).catch(err => {
            console.log(err);
            bot.answerCallbackQuery(query.id, {
                text: '❌ Failed to get Email\'s token',
                show_alert: true
            }).catch(err => {});
        })
    }
}