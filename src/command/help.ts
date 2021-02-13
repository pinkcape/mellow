import { Command } from "../structure/Command";
import Mellow from "../structure/Mellow";

export default {
  name: "help",
  description: "return help menu with commands descriptions",
  execute: (message, args) => {
    // message sender
    let author = message.author;

    // shortcut client
    let client = message.client as Mellow;

    let menu = client.commands.map((c) => `${c.name} : ${c.description}`);

    let website = "hidden";

    author.send(`${menu.join("\n")}\n• dashboard: ${website}`);
  },
} as Command;
