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
                                `.brightMagenta)
}

console.clear()
process.title = `SatoriClear - Launching...`
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
                                                                                `.brightMagenta)

async function clear(authToken, authorId, channelId, amount = Infinity) {
    const wait = async (ms) => new Promise(done => setTimeout(done, ms))

    const headers = {
        "Authorization": authToken
    };

    let deletedMessages = 0;

    const recurse = (before) => {
        let params = before ? `before=${before}` : ``;

        request({
            url: `https://discord.com/api/v9/channels/${channelId}/messages?${params}`,
            headers: headers,
            json: true
        }, async (error, response, result) => {
            if (response === undefined) {
                return recurse(before);
            }

            if (response.statusCode === 202) {
                const w = response.headers['retry-after'];

                console.log(`Ops, channel non-indexed, wait ${w}ms to index the messages`.red);

                await wait(w);

                return recurse(before)
            }

            if (response.statusCode !== 200) {
                console.log('Waiting for API!'.red, result);
                return;
            }

            for (let i in result) {
                if (deletedMessages >= amount) {
                    console.clear()
                    printClear()
                    console.log(`Success! Deleted ${deletedMessages} messages.`.green);
                    return;
                }

                let message = result[i];

                if (message.author.id === authorId && message.type !== 3) {
                    await new Promise((resolve) => {

                        const deleteRecurse = () => {
                            request.delete({
                                url: `https://discord.com/api/v9/channels/${channelId}/messages/${message.id}`,
                                headers: headers,
                                json: true
                            }, async (error, response, result) => {
                                if (error) {
                                    return deleteRecurse();
                                }
                                if (result) {
                                    if (result.retry_after !== undefined) {
                                        console.log(`Rate-limited! Waiting ${result.retry_after}ms to continue the purge.`.red)
                                        await wait(result.retry_after * 1000);
                                        return deleteRecurse();
                                    }
                                }

                                deletedMessages++;
                                resolve();
                            });
                        }

                        deleteRecurse();
                    });
                }
            }

            if (result.length === 0) {
                console.clear()
                printClear()
                console.log(`Success! Deleted ${deletedMessages} messages.`.green);
            } else {
                recurse(result[result.length - 1].id);
            }
        });
    }

    recurse();
}

client.on('ready', async () => {
    console.clear()
    process.title = `SatoriClear | Running as: ${client.user.username}`
    printClear()
})

client.on('messageCreate', async (message) => {
    if (message.author.id != client.user.id) return;
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
})
client.on("warn", (warning) => {
    console.log(`Warning: ${warning}`.yellow);
})

client.login(token)

rpcClient.on(`ready`, () => {
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
    })
})

rpcClient.login({
    clientId: '1215688377169485944'
}).catch(() => {})
