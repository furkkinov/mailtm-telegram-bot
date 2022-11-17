const bot = require("../bot.js");
module.exports = {
    command: "delete",
    run(query) {
        bot.deleteMessage(query.message.chat.id, query.message.message_id).catch(err => {});
    }
}