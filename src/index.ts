import {
    AutojoinRoomsMixin,
    LogLevel,
    LogService,
    MatrixClient,
    PantalaimonClient,
    RichConsoleLogger,
    SimpleFsStorageProvider
} from "matrix-bot-sdk";
import * as path from "path";
import config from "./config";
import CommandHandler from "./commands/handler";

// First things first: let's make the logs a bit prettier.
LogService.setLogger(new RichConsoleLogger());

// For now let's also make sure to log everything (for debugging)
LogService.setLevel(LogLevel.DEBUG);

// Print something so we know the bot is working
LogService.info("index", "Bot starting...");


// This is the startup closure where we give ourselves an async context
(async function () {
    // Prepare the storage system for the bot
    const storage = new SimpleFsStorageProvider(path.join(config.dataPath, "bot.json"));
    
    // Create the client
    let client: MatrixClient;
    if (config.pantalaimon.use) { // create a client with Pantalaimon if pantalaimon.use set to true.
        const pantalaimon = new PantalaimonClient(config.homeserverUrl, storage);
        client = await pantalaimon.createClientWithCredentials(config.pantalaimon.username, config.pantalaimon.password);
    } else { // else use Matrix client.
        client = new MatrixClient(config.homeserverUrl, config.accessToken, storage);
    }
    
    // Setup the autojoin mixin (if enabled)
    if (config.autoJoin) {
        AutojoinRoomsMixin.setupOnClient(client);
    }
    
    // Prepare the command handler
    const commands = new CommandHandler(client);
    
    
    await commands.start();
    LogService.info("index", "Starting sync...");
    await client.start(); // This blocks until the bot is killed
})();
