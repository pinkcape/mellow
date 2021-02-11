import { Client, Collection, Message } from "discord.js";
import { JoinData, Manager, Player, TrackData } from "@lavacord/discord.js";
import { Command } from "./Command";
import logger from "../util/logger";
import { URLSearchParams } from "url";
import fetch from "node-fetch";

interface Node {
  id: string;
  host: string;
  port: number;
  password: string;
}

class Mellow extends Client {
  // commands cache
  commands: Collection<string, Command> = new Collection();

  // lavacord's manager
  manager: Manager;

  // guild's queue list
  queue: Collection<string, TrackData[]> = new Collection();

  constructor(nodes: Node[]) {
    super();

    this.manager = new Manager(this, nodes);
  }

  // so we can find commands easy way
  findCommand(name: string) {
    return this.commands.get(name);
  }

  // this will load commands in cache easy
  loadCommand(command: Command) {
    logger.success(`${command.name} loaded`);
    return this.commands.set(command.name, command);
  }

  // this will load command file easy
  loadFileCommand(path: string) {
    // this will import our command file using nodejs require
    let command: Command = require(path).default;

    // loading command in cache
    return this.loadCommand(command);
  }

  // this will return a track info
  findTrack(query: string): Promise<TrackData[] | undefined> {
    let node = this.manager.idealNodes[0];

    let params = new URLSearchParams();

    params.append("identifier", query);

    let uri = `http://${node.host}:${node.port}/loadtracks?${params}`;

    return fetch(uri, {
      headers: {
        Authorization: node.password,
      },
    })
      .then((r) => r.json())
      .then((data) => data.tracks)
      .catch(logger.error);
  }

  ensureQueue(guildId: string) {
    return this.queue.get(guildId) || this.queue.set(guildId, []).get(guildId);
  }
}

export default Mellow;
