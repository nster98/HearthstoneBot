const Discord = require('discord.js');
const auth = require('./auth.json');
const fetch = require('node-fetch');
const unirest = require('unirest');
const fs = require('fs');
const jQuery = require('jQuery');

const bot = new Discord.Client();
const prefix = '!';

bot.once('ready', () => {
			console.log('Ready!');
		});

bot.login(auth.token);

bot.on('message', message => {
			// Bot should listen for !hs CARDNAME

			if (message.content.substring(0, 1) == '!')
			{
				var args = message.content.slice(prefix.length).split(/ +/);
				var cmd = args.shift().toLowerCase();

				if (cmd === 'hs')
				{
					if (!args.length)
					{
						return message.channel.send('You need to supply a search term');
					}

					var query = args.join(' ');
					decodeURI(query);

					unirest.get("https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/" + query + "?collectible=1")
					.header("X-RapidAPI-Host", "omgvamp-hearthstone-v1.p.rapidapi.com")
					.header("X-RapidAPI-Key", auth.APIToken)
					.end(function (result)
					{

						if (result.body.error)
						{
							message.channel.send("Card not found");
							return;
						}

						var embed = createEmbed(result.body[0]);

						message.channel.send({embed});
					});
				}
			}
		});

function createEmbed(cardInfo)
{
	var embed = new Discord.RichEmbed();

	embed.setTitle(cardInfo.name);
	embed.setColor(3447003);
	embed.setDescription("**Class**: " + cardInfo.playerClass + "\n**Type**: " + cardInfo.type + "\n**Set**: " + cardInfo.cardSet);
	embed.addField("🔷 Mana Cost", "**" + cardInfo.cost + "**");

	if (cardInfo.type == "Minion")
	{
		embed.addField("⚔ Attack", "**" + cardInfo.attack + "**", true);
		embed.addField("❤ Health", "**" + cardInfo.health + "**", true);
	}

	embed.addField("Text", cardInfo.text);
	embed.addField("Flavor", "```" + cardInfo.flavor + "```");
	embed.setImage(cardInfo.img);
	//embed.setThumbnail("http://media-hearth.cursecdn.com/attachments/0/151/mage_13.png");

	return embed;
}
