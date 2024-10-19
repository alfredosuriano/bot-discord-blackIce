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
let breachForce; let auditLog; let roleBotBlackIce; let roleBots; let roleNewcomer;
let chatMisbehavior; let chatStaffBotting; let chatStaffMusic; let chatBots; let chatGeneralMusic;
let chatR6log; let chatMatches; let chatBHF; let chatBHFteam; let chatPrivateMusic;

let dati; let oggi;
let titoloSond; let sondaggioR6id; let opz1utenti; let opz2utenti; let opz3utenti; 
let sondaggioTeamId; let opz1team; let opz2team; 


//INIZIALIZZAZIONE BOT
client.on(`ready`, async() => {
    client.user.setActivity(`Looking for new featurs`, { type: ActivityType.Custom });
    console.log(`Logged in as ${client.user.tag}`);
    
    breachForce = client.guilds.cache.get(idServer);
    roleBotBlackIce = breachForce.roles.cache.get(`1275447398931632183`);
    roleBots = breachForce.roles.cache.get(`1277908141836730399`);
    roleNewcomer = breachForce.roles.cache.get(`1294449977677975613`);
    roleGuest = breachForce.roles.cache.get(`917124098637856778`);
    roleTeam1 = breachForce.roles.cache.get(`1282150210658631733`);
    roleTeam2 = breachForce.roles.cache.get(`1282150274953379871`);
    roleTeam3 = breachForce.roles.cache.get(`1282150320146747533`);

    auditLog = breachForce.channels.cache.get(`1294946788599664690`);
    chatMisbehavior = breachForce.channels.cache.get(`1278395442257989742`);
    chatStaffBotting = breachForce.channels.cache.get(`1179484185283547247`);
    chatStaffMusic = breachForce.channels.cache.get(`1277745013240893521`); 
    chatBots = breachForce.channels.cache.get(`1275857529678725223`);
    chatGeneralMusic = breachForce.channels.cache.get(`1277742240504086549`);
    chatR6log = breachForce.channels.cache.get(`1185556383022731354`);
    chatMatches = breachForce.channels.cache.get(`1186626757399412796`);
    chatBHF = breachForce.channels.cache.get(`1286352959264784446`);
    chatBHFteam = breachForce.channels.cache.get(`1294457550019891240`);
    chatPrivateMusic = breachForce.channels.cache.get(`1294429329412849705`);

    
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
        if (oggi.getDay()==0) {
            return;
        } else if (oggi.getDay()==6) {
            await chatBHF.send(`Sondaggi del team disattivati per il fine settimana, torneranno lunedì :wink:`)
        } else {
            titoloTeam = `Chi gioca stasera del team BreachForce?`;
            await surveyTeam(false); console.log(`Sondaggio team BreachForce creato.`);
        }
    });
    cron.schedule('30 17 * * *', async () => {
        await surveyAll(true); await wait(3000);
        titoloSond = `Stasera chi gioca a R6?               21:30➝`;
        await surveyAll(false); console.log(`Sondaggio R6 creato - sera.`);
    });
    cron.schedule('30 20 * * *', async () => {
        await surveyForsePeople(`stasera`);
    });
    cron.schedule('30 22 * * *', async () => {
        //await surveyCanPlay();
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
        await member.roles.add(roleNewcomer.id);
        console.log(`Ruolo ${roleNewcomer.name} assegnato a ${member.displayName}`);

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
            await auditLog.send(avviso);
            console.log(`È tornato ${member.displayName}, ha la fedina sporca.`);
        }
    } catch (error) {
        console.error(`Errore durante l'assegnazione al nuovo membro:\n`, error);
    }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    // ASSEGNAZIONE VIP
    if (!oldMember.roles.cache.has(`1282050305235878029`) && newMember.roles.cache.has(`1282050305235878029`)) {
        try {
            const stanzaPrivata = await newMember.guild.channels.create({
                name: `${newMember.displayName}'s room`,
                type: Discord.ChannelType.GuildVoice,
                parent: `1244381345581371422`
            });
            await stanzaPrivata.lockPermissions();
            await stanzaPrivata.permissionOverwrites.create(newMember.id, { Connect: true });
            
            const embed = new Discord.EmbedBuilder()
                    .setColor(`#44817e`)
                    .setTitle(`BENVENUTO NEL CLUB  <a:a_champagne:1284617159460388994>`)
                    .setDescription(boosterON1 + stanzaPrivata + boosterON2);
            await newMember.send({ embeds: [embed]});

            await chatBots.send(`<:server_booster:1294952680816377876> ${newMember.user} sta boostando il server <a:a_rocket:1284616874071429272>`);
            await chatStaffBotting.send(`<:server_booster:1294952680816377876> ${newMember.user} da ora potenzia il server.`);
            console.log(`${newMember.user.tag} da ora potenzia il server.`);
        } catch (error) {
            console.error(`Errore durante l'assegnazione del ruolo serverBooster:\n`, error);
        }
    }
    // RIMOZIONE VIP
    if (oldMember.roles.cache.has(`1282050305235878029`) && !newMember.roles.cache.has(`1282050305235878029`)) {
        try {
            const embed = new Discord.EmbedBuilder()
                    .setColor(`#44817e`)
                    .setTitle(`CI MANCHERAI  <a:a_broken_heart:1284626898596532266>`)
                    .setDescription(boosterOFF);
            await newMember.send({ embeds: [embed]});

            chatStaffBotting.send(`${newMember.user} non potenzia più il server.`);
            console.log(`${newMember.user.tag} non potenzia più il server.`);
        } catch (error) {
            console.error(`Errore durante la rimozione del ruolo serverBooster:\n`, error);
        }
    }
});

client.on(`messageCreate`, async (msg) => {
    //MUSIC CHANNELS CLEANER
    if (msg.channel===chatStaffMusic || msg.channel===chatGeneralMusic || msg.channel===chatPrivateMusic) {    
        try {
            await wait(1_000); 
            if (msg.member && msg.member.roles.cache.has(roleBots.id) || msg.member.roles.cache.has(roleBotBlackIce.id)) { return; }
            else { await msg.delete(); }
        } catch (error) { console.error(`Errore durante la pulizia in \`#music\`:\n`, error);}    
    }

    //ARCANE BOT ALERT
    else if (msg.member && msg.member.id===`437808476106784770`){
        //LEAVERS NOTIFICATION
        if (msg.content.startsWith(`**AlertLeave`)){
            try {
                const stringa = msg.content; 
                const cropped =  stringa.slice(19);
                const sizeOf = cropped.indexOf('>');
                const iDutente = cropped.slice(0, sizeOf);
                await chatMisbehavior.send(`${iDutente} <@${iDutente}> - ha abbandonato il server`);
                await msg.reply(`<a:a_goodBye:1291692360450969655>`);
            } catch (error) { console.error(`Errore durante l'annotazione di un utente che è uscito:\n`, error);}
        }
    }
});

client.on(`interactionCreate`, async (interaction) => {
    oggi = new Date(); //updating date

    //SLASH COMMANDs
    if (interaction.isCommand()) {
        try{
            const command = client.commands.get(interaction.commandName);
            if (!command) return
            command.execute(interaction, breachForce, auditLog, oggi);
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

                const ora = oggi.getHours().toString().padStart(2, '0'); const minuto = oggi.getMinutes().toString().padStart(2, '0');
                await auditLog.send(`${ora}:${minuto} - L'utente ${interaction.user} ha usato la selezione dei rank.`);

                await interaction.reply({ content: `Il tuo grado è stato aggiornato <a:a_fire:1296241404997009469>`, ephemeral: true });
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
                if (interaction.member.roles.cache.has(roleNewcomer.id)) { 
                    await interaction.reply({ content: `Candidatura già inviata <a:a_check_mark:1284616858405703803>`, ephemeral: true });
                    return;
                }
                else if (interaction.member.roles.cache.has(roleTeam1.id) || interaction.member.roles.cache.has(roleTeam2.id) || interaction.member.roles.cache.has(roleTeam3.id)) {
                    await interaction.reply({ content: `Ma cosa vuoi? Sei già nel team <a:a_lotOfLaugh:1296555587726868480>`, ephemeral: true });
                    return;
                } else {                
                    await interaction.member.roles.add(roleNewcomer);
                    await chatStaffBotting.send({ content: `**AUDITION:** l'utente ${interaction.user} si è candidato per il provino del team.`});
                    await interaction.reply({ content: `Candidatura inviata <a:a_check_mark:1284616858405703803> \n Ora leggi attentamente le istruzioni in <#1270759895586574347>`, ephemeral: true });
                }
            } catch(error) {
                console.error(`Errore nell'esecuzione del bottone audition:\n`, error);
                await interaction.reply({ content: erroremsg, ephemeral: true });
            }
        }

        // OSPITE
        else if (interaction.customId == `ospiteButton`) {
            try {
                await auditLog.send(`L'utente ${interaction.user} ha appena trasferito ${interaction.user} ad ospite.`);
                await auditLog.send(interaction.message);
            } catch(error) {
                console.error(`Errore nell'esecuzione del bottone ospite:\n`, error);
                await interaction.reply({ content: erroremsg, ephemeral: true });
            }
        }

        // INVITO
        else if (interaction.customId == `invitoButton`) {
            try {
                const invito = await breachForce.channels.cache.get(`1270759895586574347`).createInvite({ maxAge: 86400, maxUses: 1});
                await interaction.reply({ content: `Ecco l'invito che mi hai chiesto: ${invito}`, ephemeral: true });
                await auditLog.send(`L'utente ${interaction.user} ha appena creato un link d'invito.`);
            } catch(error) {
                console.error(`Errore nell'esecuzione del bottone invito:\n`, error);
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
                    const ora = oggi.getHours().toString().padStart(2, '0'); const minuto = oggi.getMinutes().toString().padStart(2, '0');
                    await auditLog.send(`${ora}:${minuto} - L'utente ${interaction.user} ha cliccato su \`Ci sono\` nel log generale.`);
                } else
                //R6 button2
                if (interaction.customId == `R6button2`) {    
                    if (opz2utenti.includes(utente)) { return await interaction.deferUpdate();}
                    await opz2utenti.push(`${utente}`);
                    if (opz1utenti.includes(utente)) { opz1utenti = opz1utenti.filter(elemento => elemento !== utente);}
                    if (opz3utenti.includes(utente)) { opz3utenti = opz3utenti.filter(elemento => elemento !== utente);}
                    await surveyAll(false);
                    await interaction.deferUpdate();
                    const ora = oggi.getHours().toString().padStart(2, '0'); const minuto = oggi.getMinutes().toString().padStart(2, '0');
                    await auditLog.send(`${ora}:${minuto} - L'utente ${interaction.user} ha cliccato su \`Non ci sono\` nel log generale.`);
                } else
                //R6 button3
                if (interaction.customId == `R6button3`) {    
                    if (opz3utenti.includes(utente)) { return await interaction.deferUpdate();}
                    await opz3utenti.push(`${utente}`);
                    if (opz1utenti.includes(utente)) { opz1utenti = opz1utenti.filter(elemento => elemento !== utente);}
                    if (opz2utenti.includes(utente)) { opz2utenti = opz2utenti.filter(elemento => elemento !== utente);}
                    await surveyAll(false);
                    await interaction.deferUpdate();
                    const ora = oggi.getHours().toString().padStart(2, '0'); const minuto = oggi.getMinutes().toString().padStart(2, '0');
                    await auditLog.send(`${ora}:${minuto} - L'utente ${interaction.user} ha cliccato su \`Forse\` nel log generale.`);
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
                    if (opz1team.some(indice => indice.slice(5) === utente)) { return await interaction.deferUpdate();}
                    let team = ``;
                    if (interaction.member.roles.cache.has('1282150210658631733')) { team = `T1`; }
                    else if (interaction.member.roles.cache.has('1282150274953379871')) { team = `T2`; }
                    else if (interaction.member.roles.cache.has('1282150320146747533')) { team = `T3`; }
                    await opz1team.push(`${team} - ${utente}`);
                    opz1team.sort((a, b) => a.localeCompare(b));
                    opz2team = opz2team.filter(indice => indice.slice(5) !== utente);
                    await surveyTeam(false);
                    await interaction.deferUpdate();
                    const ora = oggi.getHours().toString().padStart(2, '0'); const minuto = oggi.getMinutes().toString().padStart(2, '0');
                    await auditLog.send(`${ora}:${minuto} - L'utente ${interaction.user} ha cliccato su \`Ci sono\` nel log del Team.`);
                } else
                //Team button2
                if (interaction.customId == `teamButton2`) {    
                    if (opz2team.some(indice => indice.slice(5) === utente)) { return await interaction.deferUpdate();}
                    let team = ``;
                    if (interaction.member.roles.cache.has('1282150210658631733')) { team = `T1`; }
                    else if (interaction.member.roles.cache.has('1282150274953379871')) { team = `T2`; }
                    else if (interaction.member.roles.cache.has('1282150320146747533')) { team = `T3`; }
                    await opz2team.push(`${team} - ${utente}`);
                    opz2team.sort((a, b) => a.localeCompare(b));
                    opz1team = opz1team.filter(indice => indice.slice(5) !== utente);
                    await surveyTeam(false);
                    await interaction.deferUpdate();
                    const ora = oggi.getHours().toString().padStart(2, '0'); const minuto = oggi.getMinutes().toString().padStart(2, '0');
                    await auditLog.send(`${ora}:${minuto} - L'utente ${interaction.user} ha cliccato su \`Non ci sono\` nel log del Team.`);
                }
            } catch(error) {
                console.error(`Errore nell'esecuzione di uno dei bottoni del team:\n`, error);
                await interaction.reply({ content: erroremsg, ephemeral: true });
            };
        }
    }
});



async function everyDayStuff(){
    oggi = new Date();
    console.log(` `);
    console.log(`Data odierna: ${oggi.toDateString()}`);

    await surveyAll(true);
    if (oggi.getDay()==0 || oggi.getDay()==6){ 
        console.log(`Disattivato e resettato il sondaggio.`);
    } else {
        await surveyTeam(true);
        console.log(`Disattivati e resettati i sondaggi.`);
    }
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
        await chatR6log.reply({ content: erroremsg, ephemeral: true });
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
            const sondaggio = await chatR6log.messages.fetch(sondaggioR6id);
            await sondaggio.edit({ content:``, components:[] });
            sondaggioR6id = "0"; opz1utenti = []; opz2utenti = []; opz3utenti = [];
            await aggiornaDatabase();
            return;
        } else {
            if(sondaggioR6id == "0") {
                const sondaggio = await chatR6log.send({content: `||@everyone||`, embeds: [embed], components: [row]});
                sondaggioR6id = sondaggio.id;
            } else {
                const sondaggio = await chatR6log.messages.fetch(sondaggioR6id);
                await sondaggio.edit({content: `||@everyone||`, embeds: [embed], components: [row]});
            };
            await aggiornaDatabase();
        }
    } catch (error) { console.error(`Errore nella funzione surveyAll():\n`, error);};
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
            chatMatches.send(
`> **Forse, vi aggiorno**
> ${listaForse}
Quindi ${when} ${who}?`);
        }
    } catch (error) { console.error(`Errore nella funzione surveyForsePeople():\n`, error);}
};

async function surveyTeam(disattiva){
    const teamTags =`<@&1282150210658631733> <@&1282150274953379871> <@&1282150320146747533>`;
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
            const sondaggio = await chatBHF.messages.fetch(sondaggioTeamId);
            await sondaggio.edit({ content:``, components:[] });
            sondaggioTeamId = "0"; opz1team = []; opz2team = [];
            await aggiornaDatabase();
            return;
        } else {    
            if(sondaggioTeamId == "0") {
                const sondaggio = await chatBHF.send({content: `||${teamTags}||`, embeds: [embed], components: [row]});
                sondaggioTeamId = sondaggio.id;
            } else {
                const sondaggio = await chatBHF.messages.fetch(sondaggioTeamId);
                await sondaggio.edit({content: `||${teamTags}||`, embeds: [embed], components: [row]});
            };
            await aggiornaDatabase();
        }    
    } catch (error) { console.error(`Errore nella funzione surveyTeam():\n`, error);};
};

async function surveyCanPlay(when){
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
            chatMatches.send(
`> **Forse, vi aggiorno**
> ${listaForse}
Quindi ${when} ${who}?`);
        }
    } catch (error) { console.error(`Errore nella funzione surveyForsePeople():\n`, error);}
};

const erroremsg = "Si è verificato un errore durante l'esecuzione del comando, riprova!\nSe l'errore persiste, contatta <@354677504142868493> :saluting_face:";

const boosterON1 = `Grazie per aver potenziato il server, il tuo supporto è fondamentale per consentirci di migliorare e offrire sempre novità al nostro team :white_heart:\n\n
Per questo ti abbiamo riservato per te un regalo speciale:\n<#`;
const boosterON2 = `>
Ho creato un tuo canale privato con permessi sbloccati, dove solo tu hai la possibilità di entrare e per dovrai spostare gli altri da \`🔇・waiting\`\n\n
Ancora grazie per il tuo supporto! Siamo davvero felici di averti in **BreachForce**. Continua a goderti il server e facci sapere se hai domande o suggerimenti, non smettiamo mai di aggiungere cose nuove! <:icon_blackIce:1276318911545081916>`;

const boosterOFF = `A quanto pare non stai più potenziando il server. In ogni caso, ci teniamo a ringraziarti per il supporto che ci hai dato finora. È anche grazie a membri come te che il nostro team cresce e si migliora ogni giorno.\n\n
Anche se non sei più un server booster, sappi che le porte sono sempre aperte!
Ricorda che, se volessi, tra 7 giorni puoi spostare i tuoi boost di nuovo da noi :eyes:\n\n
Speriamo di rivederti presto col diamante fucsia! <:leaf_black_ice:1276318911545081916>`;