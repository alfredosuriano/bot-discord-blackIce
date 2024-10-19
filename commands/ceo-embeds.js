const wait = require('node:timers/promises').setTimeout;
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ceo-embeds')
        .setDescription('Genera automaticamente tutti gli embed di default.')
        .addStringOption(option =>
            option.setName('embed')
            .setDescription('Seleziona quale embed devi generare')
            .setRequired(true)
            .addChoices(
                { name: 'audition', value: 'audition'},
                { name: 'guest', value: 'guest'},
                { name: 'invite', value: 'invite'},                
                { name: 'maintenance', value: 'maintenance'},
                { name: 'rank', value: 'rank'})
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, breachForce, auditLog, oggi) {
        try {
            const embed = interaction.options.getString('embed');
            const canale = interaction.channel;
            if ( embed === 'audition') {
                const embed = new Discord.EmbedBuilder()
                    .setColor(`#44817e`)
                    .setTitle(`TEAM RANKED`)
                    .setDescription(`Questa categoria è privata e riservata esclusivamente ai membri del Team Ranked. 
Se pensi di avere le capacità per farne parte, il primo passo è fare il **provino**.

**N.B.** Far parte del team significa prendere il gioco seriamente. Allenamenti, critiche, miglioramenti: tutto fa parte del percorso. Quando il team sceglie una data, dovrai rankare SOLO con il team. Entrando, accetti un patto di esclusività.
**Se non riesci a rispettare quanto scritto sopra, non candidarti.**

Clicca sul pulsante qui sotto per aprire la tua candidatura e preparati a dimostrare le tue abilità. Non è una passeggiata, ma se ce la farai, sarai uno dei nostri!
In bocca al lupo! <:leaf_black_ice:1276318911545081916>`);

                const button = new Discord.ButtonBuilder()
                    .setLabel(`Candidati`)
                    .setStyle(Discord.ButtonStyle.Success)
                    .setCustomId(`auditionButton`);
                
                const row = new Discord.ActionRowBuilder()
                    .addComponents(button);

                await canale.send({ embeds: [embed], components: [row] });
                console.log(`Embed-audition generato.`);
                await interaction.reply({ content: `Done <a:a_check_mark:1284616858405703803>`, ephemeral: true });
            }

            else if ( embed === 'guest') {
                const embed = new Discord.EmbedBuilder()
                    .setColor(`#44817e`)
                    .setTitle(`OSPTIT`)
                    .setDescription(`a`);

                const button = new Discord.ButtonBuilder()
                    .setLabel(`TRASFERISCI`)
                    .setStyle(Discord.ButtonStyle.Success)
                    .setCustomId(`ospiteButton`);
                
                const row = new Discord.ActionRowBuilder()
                    .addComponents(button);

                await canale.send({ embeds: [embed], components: [row] });
                console.log(`Embed-guest generato.`);
                await interaction.reply({ content: `Done <a:a_check_mark:1284616858405703803>`, ephemeral: true });
            }

            else if ( embed === 'invite') {
                const embed = new Discord.EmbedBuilder()
                .setColor(`#44817e`)
                .setTitle(`GENERATORE DI INVITI`)
                .setDescription(`Ormai ho preso possesso di tutto il server, quindi ho disattivato gli inviti :smiling_imp: 
Scherzo dai, il problema è che ogni nuovo membro arriva nella sezione dei provini, che ovviamente non vedi tu dentro, e quindi non riusciresti a creare un invito.
Ma per fortuna ci sono io :sunglasses:

Per ogni invito che crei, ricorda che:
- è **monouso** (dopo che un utente lo avrà usato, non funzionerà più)
- si autodistruggerà dopo **24h**
- ogni nuovo utente dovrà superare il **provino** prima di visualizzare il server

Nel caso stessi invitato un tuo amico per qualche game, può entrare come ospite.
Una volta entrato nel server vai in <#1186281368796282920> e me ne occuperò io. 
Tranquilli non mi stanco, posso fare inviti all'infinto <:leaf_black_ice:1276318911545081916>`);

                const button = new Discord.ButtonBuilder()
                    .setLabel(`GENERA`)
                    .setStyle(Discord.ButtonStyle.Success)
                    .setCustomId(`invitoButton`);
                
                const row = new Discord.ActionRowBuilder()
                    .addComponents(button);

                await canale.send({ embeds: [embed], components: [row] });
                console.log(`Embed-invite generato.`);
                await interaction.reply({ content: `Done <a:a_check_mark:1284616858405703803>`, ephemeral: true });
            }

            else if ( embed === 'maintenance') {                
                const embed = new Discord.EmbedBuilder()
                    .setColor(`#44817e`)
                    .setTitle(`:tools:  MANUTENZIONE`)
                    .setDescription(`Questo canale è in fase di sviluppo o manutenzione, ma ci siamo quasi!
Sto aspettando che scrivano le ultime linee di codice che servono per funzionare.
Spero si muovano perchè mi sono già rotto le ... :innocent:
Stay tuned <:leaf_black_ice:1276318911545081916>`);

                await canale.send({ embeds: [embed]});
                console.log(`Embed-maintenance generato.`);
                await interaction.reply({ content: `Done <a:a_check_mark:1284616858405703803>`, ephemeral: true });
            }

            else if ( embed === 'rank') {
                const embed = new Discord.EmbedBuilder()
                    .setColor(`#44817e`)
                    .setTitle(`<:rainbow6siege:1276490967310139393>  AGGIORNA IL TUO GRADO`)
                    .setDescription(`Sei in streak-lose e sei sceso di grado? Skill issue bro :smirk_cat:
Nel frattempo che trovi di nuovo le mani, aggiorna il tuo grado qui sotto, è facile!
Devi solo aprire il **menù a tendina**, scegliere il grado e io ti darò la conferma.
Ora guarda il tuo profilo <:leaf_black_ice:1276318911545081916>`);
                const rankMenu = new Discord.StringSelectMenuBuilder()
                    .setCustomId('selectRank')
                    .setPlaceholder('Quale grado sei ora?')
                    .addOptions([
                        { value: 'rank_nt', label: 'Not Ranked', emoji: ('<:rank_notranked:1276501523924520960>')},
                        { value: 'rank_c', label: 'Copper', emoji: ('<:rank_copper:1276491080237580308>')},
                        { value: 'rank_b', label: 'Bronze', emoji: ('<:rank_bronze:1276491072435912819>')},
                        { value: 'rank_s', label: 'Silver', emoji: ('<:rank_silver:1276491061912535143>')},
                        { value: 'rank_g', label: 'Gold', emoji: ('<:rank_gold:1276491048734031916>')},
                        { value: 'rank_p', label: 'Platinum', emoji: ('<:rank_platinum:1276491037988360193>')},
                        { value: 'rank_e', label: 'Emerald', emoji: ('<:rank_emerald:1276491028349845526>')},
                        { value: 'rank_d', label: 'Diamond', emoji: ('<:rank_diamond:1276491015926317056>')},
                        { value: 'rank_ch', label: 'Champion', emoji: ('<:rank_champion:1276490993356636212>')}
                    ]);
                const row = new Discord.ActionRowBuilder()
                    .addComponents(rankMenu);
                
                await canale.send({ embeds: [embed], components: [row]});
                console.log(`Embed-rank generato.`);
                await interaction.reply({ content: `Done <a:a_check_mark:1284616858405703803>`, ephemeral: true });
            }
        } catch (error) {
            console.error(`Errore durante la generazione di un emebed:\n`, error);
            await interaction.reply({ content: `Errore durante la generazione di un embed.`, ephemeral: true });
        }
    }
};