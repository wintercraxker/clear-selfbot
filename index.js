const {
    token,
    trigger
} = require('./config.json')

const request = require("request");
const colors = require('colors')
const {
    Client
} = require('discord.js-selfbot-v13')
const rpc = require('discord-rpc')
const readline = require('readline');

const client = new Client(),
    rpcClient = new rpc.Client({
        transport: 'ipc',
        checkUpdate: false
    });

process.on('unhandledRejection', e => {})
process.on('uncaughtException', e => {})
process.on('uncaughtRejection', e => {})
process.warn = () => {};

client.on("error", () => {})
client.on("warn", () => {})

function printClear() {
    console.log(`
                                             github.com/Wintercraxker

      ██████  ▄▄▄     ▄▄▄█████▓ ▒█████   ██▀███    ██▓     ▄████▄   ██▓    ▓█████ ▄▄▄      ██▀███  
    ▒██    ▒ ▒████▄   ▓  ██▒ ▓▒▒██▒  ██▒▓██ ▒ ██▒▒▓██▒    ▒██▀ ▀█  ▓██▒    ▓█   ▀▒████▄   ▓██ ▒ ██▒
    ░ ▓██▄   ▒██  ▀█▄ ▒ ▓██░ ▒░▒██░  ██▒▓██ ░▄█ ▒▒▒██▒    ▒▓█    ▄ ▒██░    ▒███  ▒██  ▀█▄ ▓██ ░▄█ ▒
      ▒   ██▒░██▄▄▄▄██░ ▓██▓ ░ ▒██   ██░▒██▀▀█▄  ░░██░    ▒▓▓▄ ▄██ ▒██░    ▒▓█  ▄░██▄▄▄▄██▒██▀▀█▄  
    ▒██████▒▒▒▓█   ▓██  ▒██▒ ░ ░ ████▓▒░░██▓ ▒██▒░░██░    ▒ ▓███▀ ▒░██████▒░▒████▒▓█   ▓██░██▓ ▒██▒
    ▒ ▒▓▒ ▒ ░░▒▒   ▓▒█  ▒ ░░   ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░ ░▓      ░ ░▒ ▒  ░░ ▒░▓  ░░░ ▒░ ░▒▒   ▓▒█░ ▒▓ ░▒▓░
    ░ ░▒  ░  ░ ░   ▒▒     ░      ░ ▒ ▒░   ░▒ ░ ▒ ░ ▒ ░      ░  ▒  ░░ ░ ▒  ░ ░ ░  ░ ░   ▒▒   ░▒ ░ ▒ 
    ░  ░  ░    ░   ▒    ░      ░ ░ ░ ▒    ░░   ░ ░ ▒ ░    ░          ░ ░      ░    ░   ▒    ░░   ░ 
          ░        ░               ░ ░     ░       ░      ░ ░     ░    ░  ░   ░        ░     ░     
    
                                ● ${client.user.tag} | Type: '${trigger}' on any chat. ●
                                               or '${trigger}' {amount}
    `.brightMagenta);
}

console.clear();
process.title = `SatoriClear - Launching...`;
console.log(`
                 ██▓    ▒█████   ▄▄▄     ▓█████▄   ██▓ ███▄    █  ▄████          
                ▓██▒   ▒██▒  ██▒▒████▄   ▒██▀ ██▌▒▓██▒ ██ ▀█   █  ██▒ ▀█         
                ▒██░   ▒██░  ██▒▒██  ▀█▄ ░██   █▌▒▒██▒▓██  ▀█ ██▒▒██░▄▄▄         
                ▒██░   ▒██   ██░░██▄▄▄▄██░▓█▄   ▌░░██░▓██▒  ▐▌██▒░▓█  ██         
                ░██████░ ████▓▒░▒▓█   ▓██░▒████▓ ░░██░▒██░   ▓██░▒▓███▀▒██ ██ ██ 
                ░ ▒░▓  ░ ▒░▒░▒░ ░▒▒   ▓▒█ ▒▒▓  ▒  ░▓  ░ ▒░   ▒ ▒ ░▒   ▒ ▒▒ ▒▒ ▒▒ 
                ░ ░ ▒    ░ ▒ ▒░ ░ ░   ▒▒  ░ ▒  ▒ ░ ▒ ░░ ░░   ░ ▒░ ░   ░ ░  ░  ░  
                ░ ░  ░ ░ ░ ▒    ░   ▒   ░ ░  ░ ░ ▒ ░   ░   ░ ░  ░   ░ ░  ░  ░  
                ░      ░ ░        ░     ░      ░           ░      ░  ░  ░  ░ 
`.brightMagenta);

async function clear(authToken, authorId, channelId, amount = Infinity, paranoid = false) {
    const wait = ms => new Promise(done => setTimeout(done, ms));
    const headers = { "Authorization": authToken };
    let deletedMessages = 0;
    let stop = false;

    async function fetchMessages(before) {
        const params = before ? `before=${before}` : '';
        return new Promise((resolve, reject) => {
            request({
                url: `https://discord.com/api/v9/channels/${channelId}/messages?${params}`,
                headers,
                json: true
            }, (error, response, result) => {
                if (error || !response) return reject(error || new Error("No response"));
                if (response.statusCode === 202) {
                    const w = response.headers['retry-after'] || 1;
                    console.log(`Ops, channel non-indexed, wait ${w}ms to index the messages`.red);
                    return wait(w * 1000).then(() => resolve([]));
                }
                if (response.statusCode !== 200) {
                    console.log('API error!'.red, result);
                    return reject(new Error(result?.message || "API error"));
                }
                resolve(result);
            });
        });
    }

    async function deleteMessage(messageId) {
        return new Promise((resolve, reject) => {
            request.delete({
                url: `https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`,
                headers,
                json: true
            }, async (error, response, result) => {
                if (error || !response) return reject(error || new Error("No response"));
                if (result && result.retry_after !== undefined) {
                    console.log(`Rate-limited! Waiting ${result.retry_after}ms to continue the purge.`.red);
                    await wait(result.retry_after * 1000);
                    return deleteMessage(messageId).then(resolve).catch(reject);
                }
                if (response.statusCode === 204) {
                    deletedMessages++;
                }
                resolve();
            });
        });
    }

    async function purge(before) {
        if (stop) return;
        try {
            const messages = await fetchMessages(before);
            if (!messages || messages.length === 0) {
                stop = true;
                console.clear();
                printClear();
                console.log(`Success! Deleted ${deletedMessages} messages.`.green);
                return;
            }
            for (const message of messages) {
                if (deletedMessages >= amount) {
                    stop = true;
                    break;
                }
                if (message.author.id === authorId && message.type !== 3) {
                    try {
                        await deleteMessage(message.id);
                        if (!paranoid) await wait(1000);
                    } catch (e) {
                        console.log(`Error deleting message: ${e.message}`.red);
                    }
                }
            }
            if (!stop) {
                await purge(messages[messages.length - 1].id);
            } else {
                console.clear();
                printClear();
                console.log(`Success! Deleted ${deletedMessages} messages.`.green);
            }
        } catch (e) {
            console.log(`Error: ${e.message}`.red);
            await wait(2000);
            await purge(before);
        }
    }

    await purge();
}

function getChannelIdFromUrl(url) {
    const match = url.match(/channels\/(?:\d+|@me)\/(\d+)/);
    return match ? match[1] : null;
}

client.on('ready', async () => {
    console.clear();
    process.title = `SatoriClear | Running as: ${client.user.username}`;
    printClear();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('\nSelect mode:'.brightMagenta);
    console.log('[1] Paranoid (Rate-Limited)'.brightMagenta);
    console.log('[2] Normal'.brightMagenta);

    rl.question('\nEnter mode number: '.brightMagenta, (modeAns) => {
        const paranoid = modeAns.trim() === '1';

        console.clear();
        printClear();

        console.log('\nSelect type:'.brightMagenta);
        console.log('[1] Trigger Satori'.brightMagenta);
        console.log('[2] Link Discord'.brightMagenta);

        rl.question('\nEnter type number: '.brightMagenta, (typeAns) => {
            if (typeAns.trim() === '1') {
                console.log('\nType the trigger in any chat to start (default: satori)'.brightMagenta);
                rl.close();
            } else if (typeAns.trim() === '2') {
                rl.question('\nPaste the Discord chat link: '.brightMagenta, (url) => {
                    const channelId = getChannelIdFromUrl(url.trim());
                    if (!channelId) {
                        console.log('\nInvalid link. Example: https://discord.com/channels/server/channel or https://discord.com/channels/@me/channel'.brightMagenta);
                        rl.close();
                        return;
                    }
                    rl.question('\nHow many messages do you want to delete? (Enter for all): '.brightMagenta, (amountStr) => {
                        let amount = parseInt(amountStr);
                        if (isNaN(amount) || amount <= 0) amount = Infinity;
                        clear(token, client.user.id, channelId, amount, paranoid);
                        console.log(`\nStarting deletion in channel ${channelId}...`.brightMagenta);
                        rl.close();
                    });
                });
            } else {
                console.log('\nInvalid type selection.'.brightMagenta);
                rl.close();
            }
        });
    });
});

client.on('messageCreate', async (message) => {
    if (message.author.id !== client.user.id) return;
    const args = message.content.split(' ');
    if (args[0].toLowerCase() === trigger) {
        const amount = parseInt(args[1]);
        message.delete().then(() => {
            if (!isNaN(amount) && amount > 0) {
                clear(token, client.user.id, message.channel.id, amount);
                console.log(`Trigger detected - Initiating the clearing process for ${amount} messages....`.green);
            } else if (args.length === 1) {
                clear(token, client.user.id, message.channel.id);
                console.log("Trigger detected - Initiating the clearing process for all messages....".green);
            } else {
                console.log("Invalid amount specified.".red);
            }
        }).catch((e) => {
            console.log(e);
        });
    }
});

client.on("error", (e) => {
    console.log(`Error: ${e.message}`.red);
});
client.on("warn", (warning) => {
    console.log(`Warning: ${warning}`.yellow);
});

client.login(token);

rpcClient.on('ready', () => {
    rpcClient.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: {
            details: "-> SatoriClear | Messages Clear",
            state: 'github.com/Wintercraxker',
            assets: {
                large_image: "img",
                small_image: 'img',
                small_text: 'github.com/Wintercraxker'
            },
            buttons: [{
                label: "Download",
                url: "https://github.com/Wintercraxker"
            }]
        }
    });
});

rpcClient.login({
    clientId: '1215688377169485944'
}).catch(() => {})
