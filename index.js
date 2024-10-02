require('dotenv').config({ path: '../.env' });
const wait = require('node:timers/promises').setTimeout;
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const { Client, GatewayIntentBits, Collection, ActivityType} = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMessageReactions,
    ]
});
client.login(process.env.blackIce);

//CARICAMENTO FILE SLASH COMMANDS
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    //console.log(`${command.data.name}.js`);
};

const idServer = "914274981410643968";
const erroremsg = "Si è verificato un errore durante l'esecuzione del comando, riprova!\nSe l'errore persiste, contatta <@354677504142868493> :saluting_face:";
let dati;
let titoloSond; let sondaggioR6id; let opz1utenti; let opz2utenti; let opz3utenti; 
let sondaggioTeamId; let opz1team; let opz2team; 


//INIZIALIZZAZIONE BOT
client.on(`ready`, async() => {
    client.user.setActivity(`Looking for new featurs`, { type: ActivityType.Custom });
    console.log(`Logged in as ${client.user.tag}`);
    
    breachForce = client.guilds.cache.get(idServer);
    roleBots = breachForce.roles.cache.get(`1277908141836730399`);
    roleVip = breachForce.roles.cache.get(`914306641250361394`);
    roleLegendary = breachForce.roles.cache.get(`1272907695250214962`);
    roleEpic = breachForce.roles.cache.get(`1271959889568338102`);
    roleRare = breachForce.roles.cache.get(`1271959802947436605`);
    roleUncommon = breachForce.roles.cache.get(`1271959320753602733`);
    roleCommon = breachForce.roles.cache.get(`917124098637856778`);
    
    chatMisbehavior = breachForce.channels.cache.get(`1278395442257989742`);
    chatStaffBots = breachForce.channels.cache.get(`1179484185283547247`);
    chatStaffMusic = breachForce.channels.cache.get(`1277745013240893521`); 
    chatBots = breachForce.channels.cache.get(`1275857529678725223`);
    chatGeneralMusic = breachForce.channels.cache.get(`1277742240504086549`);
    chatR6logs = breachForce.channels.cache.get(`1185556383022731354`);
    chatMatchmaking = breachForce.channels.cache.get(`1186626757399412796`);
    chatBFteams = breachForce.channels.cache.get(`1286352959264784446`);
    chatVipMusic = breachForce.channels.cache.get(`1196762766070001736`);

    
    //SINCRONIZZAZIONE COL DATABASE
    const fileContent = fs.readFileSync('database.json', 'utf8'); dati = JSON.parse(fileContent);
    try {
        for (const indica in dati) { if (dati.hasOwnProperty(indica)) { eval(`${indica} = dati[indica];`);}};
    } catch (error) { console.error(`Errore durante l'aggiornamento delle variabili interne:\n`, error);} 
    console.log(`Aggiornate le variabili interne con i varoli dell'istanza "dati".`);

    //SETTAGGIO DI SLASH COMMAND NEL SERVER
    try {
        await breachForce.commands.set(client.commands.map(cmd => cmd.data));
        console.log(`Tutti gli SlashCommand della guild sono stati caricati correttamente.`);
    } catch (error) { console.error(`Errore durante il caricamento dei comandi della guild:\n`, error);}
    /*try { //Elimina tutti i comandi specifici della guild
        const mySlashCommands = await breachForce.commands.fetch(); 
        if (mySlashCommands.size > 0) {
            mySlashCommands.forEach(async (command) => {
                await breachForce.commands.delete(command.id);
                console.log(`Eliminato comando della guild: ${command.name}`);
            });
        } else { console.log(`Nessun comando della guild da eliminare.`);}
    } catch (error) { console.error(`Errore durante l'eliminazione dei comandi:\n`, error);}*/
    console.log(`・`);

    
    //COMANDI ORARI
    cron.schedule('1 0 * * *', async () => {
        await everyDayStuff();
    });    
    cron.schedule('0 9 * * *', async () => {
        titoloSond = `Pomeriggio chi gioca a R6?       15:00➝`;
        await surveyAll(false); console.log(`Sondaggio R6 creato - pomeriggio.`);
    });
    cron.schedule('0 14 * * *', async () => {
        await surveyForsePeople(`pomeriggio`);
    });
    cron.schedule('00 16 * * *', async () => {
        titoloTeam = `Chi gioca stasera del team BreachForce?`;
        await surveyTeam(false); console.log(`Sondaggio team BreachForce creato.`);
    });    
    cron.schedule('30 17 * * *', async () => {
        await surveyAll(true); await wait(3000);
        titoloSond = `Stasera chi gioca a R6?               21:30➝`;
        await surveyAll(false); console.log(`Sondaggio R6 creato - sera.`);
    });
    cron.schedule('30 20 * * *', async () => {
        await surveyForsePeople(`stasera`);
    });
});



client.on('guildMemberAdd', async member => {    
    try {
        // NUOVI MEMBRI RUOLO COMMON
        if (member.user.bot) {
            await member.roles.add(roleBots.id);
            console.log(`È stato aggiunto il ruolo ${roleBots.name} a ${member.user.tag}.`);
            return;
        }
        await member.roles.add(roleCommon.id);
        console.log(`Ruolo ${roleCommon.name} assegnato a ${member.displayName}`);

        const idMembro = member.id;
        const ultimi100msg = await chatMisbehavior.messages.fetch({ limit: 100 });
        let avviso = `:warning: È tornato ${member}, ha la fedina sporca: `
        let trovato = false;
        ultimi100msg.forEach(msg => {
            if (msg.content.startsWith(idMembro)) { 
                avviso += `${msg.url} `;
                trovato = true;
            }
        });
        if (trovato) {
            await chatStaffBots.send(avviso);
            console.log(`È entrato ${member.displayName}, ha la fedina sporca.`);
        }
    } catch (error) {
        console.error(`Errore durante l'assegnazione al nuovo membro:\n`, error);
    }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    // ASSEGNAZIONE VIP
    if (oldMember.premiumSince === null && newMember.premiumSince !== null) {
        try {
            await newMember.roles.add(roleVip);
            await chatStaffBots.send(`${newMember.user} da ora potenzia il server, aggiunto il ruolo <@&914306641250361394>`);
            const canaleVocale = await newMember.guild.channels.create({
                name: `${newMember.displayName}'s room`,
                type: Discord.ChannelType.GuildVoice,
                parent: `1283787724100337666` //`1244381345581371422`
            });
            await canaleVocale.lockPermissions();
            await canaleVocale.permissionOverwrites.create(newMember.id, { Connect: true });

            await chatBots.send(`<a:a_rocket:1284616874071429272> ${newMember.user} sta boostando il server, ora è un <@&914306641250361394><:icon_vip:1284616733356851202>`);

            const embed = new Discord.EmbedBuilder()
                    .setColor(`#44817e`)
                    .setTitle(`<a:a_champagne:1284617159460388994> BENVENUTO NEL CLUB VIP`)
                    .setDescription(
`Grazie per aver potenziato il server, il tuo supporto è fondamentale per migliorare la nostra community :heart_hands: Per questo abbiamo riservato per te alcuni vantaggi esclusivi:

<:icon_vip:1284605376699830315> Tutti vedranno il tuo status con l'icona esclusiva dei potenziatori del server
:mega: Divertiti ad usare tutti i suoni della nostra soundbar
<:icon_bot:1284619310836486438> I bot della musica sono al tuo comando, ma occhio a non confonderli
:tv: Tutto è più semplice e veloce quando puoi condividere lo schermo
:lock: Accesso alla lounge VIP, una categoria dedicata solo ai VIP
:speech_balloon:  Canale privato con permessi sbloccati, entrano solo se li sposti tu

Ancora grazie per il tuo supporto! Siamo davvero felici di averti qui in **BreachForce**. Continua a goderti i tuoi privilegi e facci sapere se hai domande o suggerimenti, non smettiamo mai di aggiungere cose nuove e migliorare! <:leaf_black_ice:1276318911545081916>`);     
            await newMember.send({ embeds: [embed]});
            console.log(`Ruolo VIP assegnato a ${newMember.user.tag}`);
        } catch (error) {
            console.error(`Errore durante l'assegnazione del ruolo VIP:\n`, error);
        }
    }
    // RIMOZIONE VIP
    if (oldMember.premiumSince !== null && newMember.premiumSince === null) {
        try {
            await newMember.roles.remove(roleVip);
            chatStaffBots.send(`${newMember.user} ha tolto il potenziamento, rimosso il ruolo <@&914306641250361394>`);

            const embed = new Discord.EmbedBuilder()
                    .setColor(`#44817e`)
                    .setTitle(`<a:a_broken_heart:1284626898596532266>  CI MANCHERAI`)
                    .setDescription(
`A quanto pare non fai più parte del nostro club VIP. In ogni caso, ci teniamo a ringraziarti per il supporto che hai dato finora al server. È anche grazie a membri come te che la nostra community cresce e si migliora ogni giorno.

Anche se non sei più un VIP, sappi che le porte sono sempre aperte!
Ricorda che, se volessi, tra 7 giorni puoi spostare i tuoi boost di nuovo da noi :eyes:

Speriamo di rivederti presto tra i nostri VIP! <:leaf_black_ice:1276318911545081916>`);     
            await newMember.send({ embeds: [embed]});
            console.log(`Ruolo VIP rimosso a ${newMember.user.tag}`);
        } catch (error) {
            console.error(`Errore durante la rimozione del ruolo VIP:\n`, error);
        }
    }
});

client.on(`messageCreate`, async (msg) => {
    //KENA CHANNEL CLEANER
    if (msg.channel===chatStaffMusic || msg.channel===chatGeneralMusic || msg.channel===chatVipMusic) {
        try {
            await wait(1_000); 
            if (msg.member.roles.cache.has(roleBots.id) || msg.member.id===`1189273148865138739`) { return; } // 1179471109494669433
            else { await msg.delete(); }
        } catch (error) { console.error(`Errore durante la pulizia in \`#・music\`:\n`, error);}
    }

    //KENA STATUS ALERT
    else if (msg.member.id===`1282998754622046252`){
        try {
            const titolo = `**UPDATE:** `;
            if (msg.content.startsWith(`<:online:`)){
                const messaggio = `è di nuovo operativo <a:a_musical_notes:1286420789842939924>`; // <a:a_musical_notes:1286444739318513706>
                await chatStaffMusic.send(titolo + `<@910965659851178054> ` + messaggio);
                await chatGeneralMusic.send(titolo + `<@910978145610526761> ` + messaggio);
                await chatVipMusic.send(titolo + `<@910965623671119942> ` + messaggio);
                await msg.reply(`<a:a_musical_notes:1286420789842939924> Avviso risolutorio inoltrato a tutte le chat \`#・music\``);
                console.log(`Tutti i Kenabots sono tornati online.`);
            }
            else if (msg.content.startsWith(`<:idle:`)){
                const messaggio = `è temporanemante fuori uso <a:a_maintenance:1286432778778448022>`; // <a:a_maintenance:1286444726773481556>
                await chatStaffMusic.send(titolo + `<@910965659851178054> ` + messaggio);
                await chatGeneralMusic.send(titolo + `<@910978145610526761> ` + messaggio);
                await chatVipMusic.send(titolo + `<@910965623671119942> ` + messaggio);
                await msg.reply(`<a:a_maintenance:1286432778778448022> Avviso manutenzione inoltrato a tutte le chat \`#・music\``);
                console.log(`Tutti i Kenabots sono offline.`);
            }
        } catch (error) { console.error(`Errore durante le comunicazioni di Kena:\n`, error);}
    }

    //BOT ALERT LEVEL UP
    else if (msg.member.id===`437808476106784770`) {
        try {
            if (msg.content.startsWith(`**BotAlertLevelUp`)) {
                const stringa = msg.content; 
                const cropped =  stringa.slice(24);
                const sizeOf = cropped.indexOf('>');
                const iDutente = cropped.slice(0, sizeOf);
                const utente = breachForce.members.cache.get(iDutente);
                const livello = stringa.slice(-2);
                if (livello == ` 5`) {
                    await utente.roles.remove(roleCommon.id);
                    await chatBots.send(`<@${utente.id}> è arrivato al ruolo ${roleUncommon}, EZ :champagne:`);
                    await msg.reply(`Ho aggiornato correttamente il livello a ${roleUncommon}`);
                    return;
                }
                else if (livello == `10`) { 
                    await utente.roles.remove(roleUncommon.id);
                    await chatBots.send(`<@${utente.id}> è arrivato al ruolo ${roleRare}, EZ :champagne:`);
                    await msg.reply(`Ho aggiornato correttamente il livello a ${roleRare}`);
                    return;
                } 
                else if (livello == `15`) {
                    await utente.roles.remove(roleRare.id);
                    await chatBots.send(`<@${utente.id}> è arrivato al ruolo ${roleEpic}, EZ :champagne:`);
                    await msg.reply(`Ho aggiornato correttamente il livello a ${roleEpic}`);
                    return;
                }
                else if (livello == `20`) { 
                    await utente.roles.remove(roleEpic.id);
                    await chatBots.send(`<@${utente.id}> è arrivato al ruolo ${roleLegendary}, EZ :champagne:`);
                    await msg.reply(`Ho aggiornato correttamente il livello a ${roleLegendary}`);
                    return;
                }
                else {
                    await chatBots.send(`<@${utente.id}> ha raggiunto il livello ${livello}. GG :beers:`);
                    await msg.reply(`Nessun ruolo da aggiornare.`);
                    return;
                }
            }
        } catch (error) { console.error(`Errore durante l'assegnazione del nuovo livello:\n`, error);}    
    }
});

client.on(`interactionCreate`, async (interaction) => {
    //SLASH COMMANDs
    if (interaction.isCommand()) {
        try{
            const command = client.commands.get(interaction.commandName);
            if (!command) return
            command.execute(interaction);
        } catch(error) {
            console.error(`Errore nell'esecuzione di uno slashCommand:\n`, error);
            await interaction.reply({ content: erroremsg, ephemeral: true });
        }   
    }

    //SELECT MENU
    else if (interaction.isStringSelectMenu()) {
        //RANK
        if (interaction.customId === 'selectRank') {
            try{
                const removeRank = [
                    `1277371451447574609`, //notranked
                    `1276304976712564771`,  //copper
                    `1276305670110580871`,  //bronze
                    `1276306431204655176`,  //silver
                    `1276306554295029940`,  //gold
                    `1276309366567342090`,  //platinum
                    `1276309713671163997`,  //emerald
                    `1276310092194644031`,  //diamond
                    `1276310300215218247`,  //champion
                ];
                const rankIDmap = {
                    rank_nt: `1277371451447574609`, //notranked
                    rank_c: `1276304976712564771`, //copper
                    rank_b: `1276305670110580871`, //bronze
                    rank_s: `1276306431204655176`, //silver
                    rank_g: `1276306554295029940`, //gold
                    rank_p: `1276309366567342090`, //platinum
                    rank_e: `1276309713671163997`, //emerald
                    rank_d: `1276310092194644031`, //diamond
                    rank_ch: `1276310300215218247`, //champion
                };
                removeRank.forEach(async roleId => {
                    if (interaction.member.roles.cache.has(roleId)) {
                        await interaction.member.roles.remove(roleId);
                    }
                });
                const selectedRank = interaction.values[0];
                await interaction.member.roles.add(rankIDmap[selectedRank]);

                await interaction.reply({ content: `Il tuo grado è stato aggiornato :flame:`, ephemeral: true });
                await wait(5_000);
                await interaction.deleteReply();
            } catch(error) {
                console.error(`Errore durante l'assegnazione del ruolo:\n`, error);
                await interaction.reply({ content: erroremsg, ephemeral: true });
            }
        } 
    }

    // BUTTON
    else if (interaction.isButton()) {
         // AUDITION
        if (interaction.customId == `auditionButton`) {
            try {
                const auditionRole = breachForce.roles.cache.get(`1281637927839072379`); // 1271510204244033547
                await interaction.member.roles.add(auditionRole);
                await chatStaffBots.send({ content: `**AUDITION:** l'utente ${interaction.user} si è candidato per il provino del team.`});
                await interaction.reply({ content: `Candidatura inviata <a:a_check_mark:1284616858405703803> \n Ora leggi attentamente le istruzioni in <#1270759895586574347>`, ephemeral: true });
            } catch(error) {
                console.error(`Errore nell'esecuzione del bottone audition:\n`, error);
                await interaction.reply({ content: erroremsg, ephemeral: true });
            }
        }
        
        // BOTTONI DI TUTTI
        else if (interaction.customId.startsWith(`R6`)){
            const utente = interaction.user.displayName;
            try {
                //R6 button1
                if (interaction.customId == `R6button1`) {    
                    if (opz1utenti.includes(utente)) { return await interaction.deferUpdate();}                
                    await opz1utenti.push(`${utente}`);
                    if (opz2utenti.includes(utente)) { opz2utenti = opz2utenti.filter(elemento => elemento !== utente);}
                    if (opz3utenti.includes(utente)) { opz3utenti = opz3utenti.filter(elemento => elemento !== utente);}
                    await surveyAll(false);
                    await interaction.deferUpdate();
                } else
                //R6 button2
                if (interaction.customId == `R6button2`) {    
                    if (opz2utenti.includes(utente)) { return await interaction.deferUpdate();}
                    await opz2utenti.push(`${utente}`);
                    if (opz1utenti.includes(utente)) { opz1utenti = opz1utenti.filter(elemento => elemento !== utente);}
                    if (opz3utenti.includes(utente)) { opz3utenti = opz3utenti.filter(elemento => elemento !== utente);}
                    await surveyAll(false);
                    await interaction.deferUpdate();
                } else
                //R6 button3
                if (interaction.customId == `R6button3`) {    
                    if (opz3utenti.includes(utente)) { return await interaction.deferUpdate();}
                    await opz3utenti.push(`${utente}`);
                    if (opz1utenti.includes(utente)) { opz1utenti = opz1utenti.filter(elemento => elemento !== utente);}
                    if (opz2utenti.includes(utente)) { opz2utenti = opz2utenti.filter(elemento => elemento !== utente);}
                    await surveyAll(false);
                    await interaction.deferUpdate();
                }
            } catch(error) {
                console.error(`Errore nell'esecuzione di uno dei bottoni R6:\n`, error);
                await interaction.reply({ content: erroremsg, ephemeral: true });
            };
        }

        // BOTTONI DEL TEAM
        else if (interaction.customId.startsWith(`team`)){
            const utente = interaction.user.displayName;
            try {
                //Team button1
                if (interaction.customId == `teamButton1`) {    
                    if (opz1team.includes(utente)) { return await interaction.deferUpdate();}                
                    await opz1team.push(`${utente}`);
                    if (opz2team.includes(utente)) { opz2team = opz2team.filter(elemento => elemento !== utente);}
                    await surveyTeam(false);
                    await interaction.deferUpdate();
                } else
                //Team button2
                if (interaction.customId == `teamButton2`) {    
                    if (opz2team.includes(utente)) { return await interaction.deferUpdate();}
                    await opz2team.push(`${utente}`);
                    if (opz1team.includes(utente)) { opz1team = opz1team.filter(elemento => elemento !== utente);}
                    await surveyTeam(false);
                    await interaction.deferUpdate();
                }
            } catch(error) {
                console.error(`Errore nell'esecuzione di uno dei bottoni del team:\n`, error);
                await interaction.reply({ content: erroremsg, ephemeral: true });
            };
        }
    }
});



async function everyDayStuff(){
    let oggi = new Date();
    console.log(` `);
    console.log(`Data odierna: ${oggi.toDateString()}`);

    await surveyAll(true); 
    await surveyTeam(true);
    console.log(`Disattivati e resettati i sondaggi.`);    
};

async function aggiornaDatabase(){
    try {
        for (const indica in dati) {
            if (dati.hasOwnProperty(indica)) {
                eval(`dati[indica] = ${indica};`);
            }
        }
        fs.writeFileSync('database.json', JSON.stringify(dati, null, 2), 'utf8');
        const fileContent = fs.readFileSync('database.json', 'utf8');
        dati = JSON.parse(fileContent);
    } catch (error) {
        console.error(`Errore nella funzione aggiornaDatabase():\n`, error);
        await chatR6logs.reply({ content: erroremsg, ephemeral: true });
    };
};

async function surveyAll(disattiva){
    const descrizione = `Usiamo questo sondaggio per evitare di intasare le chat, facile e veloce :wink:`;
    try {
        const embed = new Discord.EmbedBuilder()
            .setColor(`#44817e`)
            .setTitle(`${titoloSond}`)
            .setDescription(`${descrizione}`)
            .addFields(
                { name: `> Ci sono`, 
                    value: ` 
                    ${opz1utenti.map((opz1utente) => `${opz1utente}`).join('\n')}`, 
                inline: true },
                { name: `> Non ci sono`, 
                    value: ` 
                    ${opz2utenti.map((opz2utente) => `${opz2utente}`).join('\n')}`, 
                inline: true },
                { name: `> Forse, vi aggiorno`, 
                    value: ` 
                    ${opz3utenti.map((opz3utente) => `${opz3utente}`).join('\n')}`, 
                inline: true }
            );
        
        const button1 = new Discord.ButtonBuilder()
            .setLabel(`Ci sono`)
            .setStyle(Discord.ButtonStyle.Success)
            .setCustomId(`R6button1`);
        const button2 = new Discord.ButtonBuilder()
            .setLabel(`Non ci sono`)
            .setStyle(Discord.ButtonStyle.Success)
            .setCustomId(`R6button2`);
        const button3 = new Discord.ButtonBuilder()
            .setLabel(`Forse`)
            .setStyle(Discord.ButtonStyle.Success)
            .setCustomId(`R6button3`);      

        const row = new Discord.ActionRowBuilder()
            .addComponents(button1,button2,button3);

        if(disattiva){
            const sondaggio = await chatR6logs.messages.fetch(sondaggioR6id);
            await sondaggio.edit({ content:``, components:[] });
            sondaggioR6id = "0"; opz1utenti = []; opz2utenti = []; opz3utenti = [];
            await aggiornaDatabase();
            return;
        } else {
            if(sondaggioR6id == "0") {
                const sondaggio = await chatR6logs.send({content: `||@everyone||`, embeds: [embed], components: [row]});
                sondaggioR6id = sondaggio.id;
            } else {
                const sondaggio = await chatR6logs.messages.fetch(sondaggioR6id);
                await sondaggio.edit({content: `||@everyone||`, embeds: [embed], components: [row]});
            };
            await aggiornaDatabase();
        }
    } catch (error) { console.error(`Errore nella funzione surveyAll():\n`, error);};
};

async function surveyTeam(disattiva){
    const descrizione = `Usiamo questo sondaggio per evitare di intasare le chat, facile e veloce 😉`; //-----------------------------------------------------
    try {
        const embed = new Discord.EmbedBuilder()
            .setColor(`#44817e`)
            .setTitle(`Chi gioca stasera del team BreachForce?`)
            .setDescription(`${descrizione}`)
            .addFields(
                { name: `> Ci sono`, 
                    value: ` 
                    ${opz1team.map((opz1team) => `${opz1team}`).join('\n')}`, 
                inline: true },
                { name: `> Non ci sono`, 
                    value: ` 
                    ${opz2team.map((opz2team) => `${opz2team}`).join('\n')}`, 
                inline: true }
            );
        
        const button1 = new Discord.ButtonBuilder()
            .setLabel(`Ci sono`)
            .setStyle(Discord.ButtonStyle.Success)
            .setCustomId(`teamButton1`);
        const button2 = new Discord.ButtonBuilder()
            .setLabel(`Non ci sono`)
            .setStyle(Discord.ButtonStyle.Success)
            .setCustomId(`teamButton2`);      

        const row = new Discord.ActionRowBuilder()
            .addComponents(button1,button2);
        
        if(disattiva){
            const sondaggio = await chatBFteams.messages.fetch(sondaggioTeamId);
            await sondaggio.edit({ content:``, components:[] });
            sondaggioTeamId = "0"; opz1team = []; opz2team = [];
            await aggiornaDatabase();
            return;
        } else {    
            if(sondaggioTeamId == "0") {
                const sondaggio = await chatBFteams.send({content: `||@everyone||`, embeds: [embed], components: [row]});
                sondaggioTeamId = sondaggio.id;
            } else {
                const sondaggio = await chatBFteams.messages.fetch(sondaggioTeamId);
                await sondaggio.edit({content: `||@everyone||`, embeds: [embed], components: [row]});
            };
            await aggiornaDatabase();
        }    
    } catch (error) { console.error(`Errore nella funzione surveyTeam():\n`, error);};
};

async function surveyForsePeople(when){
    let who = `voi giocate`;
    let listaForse = ``;
    try {
        if (opz3utenti.length > 0) {
            for (let i = 0; i < opz3utenti.length; i++) {
                const membro = await breachForce.members.fetch({ query: opz3utenti[i], limit: 1 });
                if (membro && membro.size > 0) {
                    const tag = `<@${membro.first().id}> `;
                    listaForse = listaForse + tag;
                } else {
                    const tag = `@${opz3utenti[i]} `;
                    listaForse = listaForse + tag;
                    console.log(`ATTENZIONE!!! Utente non trovato con il displayName ${opz3utenti[i]}`);
                }
            }
            if (opz3utenti.length == 1) {
                who = `tu giochi`;
            }
            chatMatchmaking.send(
`> **Forse, vi aggiorno**
> ${listaForse}
Quindi ${when} ${who}?`);
        }
    } catch (error) { console.error(`Errore nella funzione surveyForsePeople():\n`, error);}
};