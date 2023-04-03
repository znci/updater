const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, Routes, EmbedBuilder, ActivityType } = require('discord.js');
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
], partials: [Partials.Channel] });
const fs = require('fs');
const { REST } = require('@discordjs/rest');

// Command Handler

const commandList = [];

const commands = fs.readdirSync("./commands").forEach((v) => {
	const r = require(`./commands/${v}`)
	const SCB = new SlashCommandBuilder().setName(r.command).setDescription(r.description)
	if(r.arguments) {
		r.arguments.forEach((v) => {
			let required = false;
			if(v.required === true) {
				required = true;
			} 
			switch (v.type) {
				case "string":
					SCB.addStringOption(option => 
						option.setName(v.name)
							.setDescription(v.description)
							.setRequired(required)
					)
			}
		})
	}
	commandList.push(SCB)
})


const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands("1034872869332725850", "993979667264577669"), { body: commandList })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	fs.readdirSync("./commands").forEach((v) => {
		const r = require(`./commands/${v}`)
		if (commandName === r.command) r.execute(interaction)
	})
});

// give the bot a custom status

//

client.once('ready', () => {
	console.log('Ready!');
	
	setInterval(() => {
		const random = [
			{
				name: "znci.dev",
				type: ActivityType['Watching']
			},
			{
				name: "znci repos",
				type: ActivityType['Watching']
			},
			{
				name: "znci's GitHub",
				type: ActivityType['Watching']
			},
			{
				name: "znci's Discord",
				type: ActivityType['Watching']
			},
			{
				name: "znci's Twitter",
				type: ActivityType['Watching']
			},
		];
		const randomStatus = random[Math.floor(Math.random() * random.length)];
		client.user.setActivity({
			name: randomStatus.name,
			type: randomStatus.type
		})
	}, 20000);
});
client.login(process.env.DISCORD_TOKEN);

module.exports = {
	client,
}