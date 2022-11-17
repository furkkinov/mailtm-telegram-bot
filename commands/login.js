const TelegramBot = require('node-telegram-bot-api');
const bot = require("../bot.js");
const JSONdb = require('simple-json-db');
const axios = require("axios");
module.exports = {
    command: "login",
    run(msg) {
        let db = new JSONdb('accounts.json');
        let args = msg.text.split(" ");
        if(!args[2]) {
            bot.sendMessage(msg.chat.id, "❌ *Usage*: `/login <email> <password>`", {parse_mode: "Markdown"}).then(r => {
                bot.deleteMessage(msg.chat.id, msg.message_id).catch(err => {});
                setTimeout(() => {
                    bot.deleteMessage(r.chat.id, r.message_id).catch(err => {});
                }, 7500);
            }).catch(err => {});
            return;
        }
        axios.post("https://api.mail.tm/token", { address: args[1], password: args[2] }).then(r => {
            if(r.data.token) {
                db.set(msg.chat.id, {
                    email: args[1],
                    password: args[2]
                });
                db.sync();
                bot.sendMessage(msg.chat.id, "✅ *Success. Press Update button on message or type /start*", {parse_mode: "Markdown"}).then(r => {
                    bot.deleteMessage(msg.chat.id, msg.message_id).catch(err => {});
                    setTimeout(() => {
                        bot.deleteMessage(r.chat.id, r.message_id).catch(err => {});
                    }, 15000);
                }).catch(err => {});
                return;
            } else {
                bot.sendMessage(msg.chat.id, "❌ *Failed to login. Check your address and password*", {parse_mode: "Markdown"}).then(r => {
                    bot.deleteMessage(msg.chat.id, msg.message_id).catch(err => {});
                    setTimeout(() => {
                        bot.deleteMessage(r.chat.id, r.message_id).catch(err => {});
                    }, 7500);
                }).catch(err => {});
                return;
            }
        }).catch(err => {
            console.log(err);
            bot.sendMessage(msg.chat.id, "❌ *Failed to login. Check your address and password*", {parse_mode: "Markdown"}).then(r => {
                bot.deleteMessage(msg.chat.id, msg.message_id).catch(err => {});
                setTimeout(() => {
                    bot.deleteMessage(r.chat.id, r.message_id).catch(err => {});
                }, 7500);
            }).catch(err => {});
            return;
        });
    }
}