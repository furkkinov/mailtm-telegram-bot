const bot = require("../bot.js");
const JSONdb = require('simple-json-db');
module.exports = {
    command: "start",
    run(msg) {
        let db = new JSONdb('accounts.json');
        if(!db.get(query.message.chat.id)) {
            console.log(db.get(query.message.chat.id));
            bot.sendMessage(msg.chat.id, '*Welcome to Mail.tm telegram bot*\n/register \`<address> <password>\` - Create email\n/login \`<address> <password>\` - Login to email', {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: 'Create random email', callback_data: 'create_email' }]
                    ]
                }),
                parse_mode: "Markdown"
            }).catch(err => {});
        } else {
            let acc = db.get(query.message.chat.id);
            bot.sendMessage(msg.chat.id, `*Logged as*\nEmail: \`${acc.email}\`\nPassword: \`${acc.password}\``, {
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
}