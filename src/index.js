import "dotenv/config";

import { Client, GatewayIntentBits, Collection } from "discord.js";
import loadAllHandler from "./handler/index.js";

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.totalCommandRuns = 0;
client.commands = new Collection();

loadAllHandler(client);

client.login(process.env.TOKEN);
