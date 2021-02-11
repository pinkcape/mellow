import "dotenv/config"; // we need this module to get .env variables
import Mellow from "./structure/Mellow";
import fs from "fs";
import path from "path";
import logger from "./util/logger";

// create new client
const client = new Mellow([
  {
    id: "1",
    host: "localhost",
    port: 2333,
    password: "youshallnotpass",
  },
]);

// client's prefix
const prefix = process.env.CLIENT_PREFIX || "?";

client.on("error", console.error); // log error so no app crush

client.on("warn", console.warn); // log warnings

client.once("ready", () => {
  logger.info("Running");

  // connect with lavalink
  client.manager
    .connect()
    .then(() => logger.success("Connected with lavalink"))
    .catch(logger.error);

  // commands folder path dir
  let commandDir = path.join(__dirname, "command");

  // return all files in commandDir path
  fs.readdir(commandDir, (err, files) => {
    // if error return log in console
    if (err) return console.error(err);

    // this will import every file & load it
    files.forEach((file) => client.loadFileCommand(`${commandDir}/${file}`));
  });
});

client.on("message", (message) => {
  // message sender
  let author = message.author;

  // check if the sender is a bot
  if (author.bot) return; // return if yes

  // message's channel
  let channel = message.channel;

  // check channel type
  if (channel.type !== "text") return; // return if not text

  // message text
  let content = message.content;

  // check message prefix
  if (!content.startsWith(prefix)) return; // if content didn't start with prefix return

  // extract command's name & arguments from content
  let [commandName, ...args] = content.slice(prefix.length).split(" ");

  // find command
  let command = client.findCommand(commandName);

  // check if command not exists
  if (!command) return; // return if not exists

  // run command
  command.execute(message, args);
});

// client's hidden token
let token = process.env.TOKEN;

// this will connect with discord.com
client.login(token).catch(console.error); // use catch to log errors without app crush
