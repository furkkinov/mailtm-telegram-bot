const bot = require("./bot.js");
const fs = require("fs");
let commands = {};
let actions = {};

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(f => {
    let c = require(`./commands/${f}`);
    commands[c.command] = c;
});
const actionsFiles = fs.readdirSync('./actions').filter(file => file.endsWith('.js'));
actionsFiles.forEach(f => {
    let c = require(`./actions/${f}`);
    actions[c.command] = c;
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if(!msg.text) return;
  if(commands[msg.text.replace("/", "").split(" ")[0]]) {
    commands[msg.text.replace("/", "").split(" ")[0]].run(msg);
  } else {
    bot.sendMessage(chatId, "❌ *Unknown command*", { parse_mode: "Markdown" }).then(r => {
        bot.deleteMessage(chatId, msg.message_id).catch(err => {});
        setTimeout(() => {
            bot.deleteMessage(chatId, r.message_id).catch(err => {});
        }, 10000);
    }).catch(err => {});
  }
});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    if(actions[action]) {
        actions[action].run(callbackQuery);
    } else {
        bot.answerCallbackQuery(callbackQuery.id, {
            text: "❌ Invalid action",
            show_alert: true
        }).catch(err => {
            console.log(err);
        })
    }
});