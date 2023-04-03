const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, Routes, EmbedBuilder, ActivityType  } = require('discord.js');
const core = require("../");

module.exports = {
	command: "repos",
	description: "Returns public znci tracking repos",
	execute: (interaction) => {
		let cached = core.cached;
		let embed = new EmbedBuilder()
			.setTitle("All znci tracking repos")
			.setDescription(`Total: ${cached.total}`)
			.setColor("#FF0000")
			.setTimestamp()

		cached.repos.forEach((v) => {
			let version, contributors, projectLead = "None";
			if(v['VERSION']) {
				version = v['VERSION'];
			} else {
				version = "Unknown";
			}
			if(v['CONTRIBUTORS']) {
				contributors = v['CONTRIBUTORS'];
			} else {
				contributors = "None";
			}
			if(v['PROJECT_LEAD']) {
				projectLead = v['PROJECT_LEAD'];
			} else {
				projectLead = "None";
			}
			embed.addFields(
				{ name: `<:squareannouncement:1011624886747275344> ${v['NAME']} *(${version})*`, value: `${v['DESCRIPTION']}\n\n**Contributors**\n${contributors}\n\n**Project Lead**\n${projectLead}`, inline: true}
			);
		})
		interaction.reply({ embeds: [embed] })
	}
}