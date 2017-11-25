'use strict'

// Automatic cancellation in node-telegram-bot-api is deprecated, disable it
process.env.NTBA_FIX_319 = 1;

const fs = require('fs');
const request = require('request');
const dotenv = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

/* =================================================
	FUNCTIONALITIES
====================================================*/
// Bot is running
bot.getMe().then(function(me){
	//Debug
	console.log('%s is up and running!', me.first_name);
});

//Need to create a json database to save all MozLoves sent

/* =================================================
	COMMANDS
====================================================*/
// Command /start
bot.onText(/\/start/, (msg) => {
	bot.sendMessage
	(
		msg.chat.id,
		"🙌 Hey " + msg.from.first_name + ", thank you for activated me!\nLearn more about what I can do by typing <code>/help</code>.",
		{ parse_mode: "HTML" }
	);
	//Debug
	console.log("Bot received the command /start from @" +msg.from.username);
});

// Command /help
bot.onText(/\/help/, (msg) => {
	bot.sendMessage
	(
		msg.chat.id,
		"Hi " + msg.from.first_name + ", so you need help?\nHere it is a list of things that I can do it for you:\n\n<strong>Send MozLove to others Mozillians</strong>\nType <code>@username ++</code> to add MozLove.\nType <code>@username --</code> to remove MozLove.\nType <code>/mozlove</code> to view scores.\n\n<strong>Stay up-to-date with the latest blog posts</strong>\nType <code>/mozillanews</code> to see the newest post from Mozilla.\nType <code>/firefoxnews</code> to see the newest post from Firefox.\nType <code>/hacksnews</code> to see the newest post from Hacks.\nType <code>/sumonews</code> to see the newest post from Mozilla Support team.\nType <code>/l10nnews</code> to see the newest post from Localization team.\nType <code>/repsnews</code> to see the newest post from Reps team.",
		{ parse_mode: "HTML", reply_to_message_id: msg.message_id }
	);
	//Debug
	console.log("Bot received the command /help from @" +msg.from.username);
});

// Command /mozlove (WIP)
bot.onText(/\/mozlove/, (msg) => {
	// Need to show the ranking of MozLove. For now, only sends a message saying the ranking is not ready yet.
	bot.sendMessage
	(
		msg.chat.id,
		"Sorry " + msg.from.first_name + ", ranking is not ready yet! ¯\\_(ツ)_/¯\n\n",
		{ parse_mode: "HTML", reply_to_message_id: msg.message_id }
	);
	//Debug
	console.log("Bot received the command /mozlove from @" +msg.from.username);
});

/* =================================================
	APP
====================================================*/
// MozLove (WIP)
const regex = /@([a-z0-9_]{5,})(\s?)(\+\+|--)/i;
bot.onText(regex, (msg) => {
	const parts = msg.text.match(regex);
	const target = parts[1];
	const separator = parts[2];
	const operator = parts[3];

	// If the user wants give MozLove to himself
	if( target.toLowerCase() === msg.from.username.toLowerCase() ) {
		bot.sendMessage
		(
 			msg.chat.id,
 			// Show *break the rules* message
 			"No no no, <code>don't break the rules!</code> You can't MozLove yourself. Bad human! 😈",
 			{ parse_mode: "HTML", reply_to_message_id: msg.message_id }
		);
		//Debug
		console.log(target + " is breaking the rules!");
	} else {
		bot.sendMessage
		(
			msg.chat.id,
			// Need to show the amount of MozLoves that a specific user has. For now only sends a example message.
			`${target} agora tem XX MozLove.`,
			{ parse_mode: "HTML", reply_to_message_id: msg.message_id }
		);
		//Debug
		console.log("Bot received from @" +msg.from.username+" the command: " +msg.text);
	}
});

/* =================================================
	Extras
====================================================*/
// Bot stalker (privacy mode needs to be disabled)
bot.on('message', (msg) => {
	// Bad Words
	var porra = "porra";
	var caralho = "caralho";
	var puta = "puta";
	var foda = "foda";

	if(
		msg.text.toString().toLowerCase().includes(porra) ||
		msg.text.toString().toLowerCase().includes(caralho) ||
		msg.text.toString().toLowerCase().includes(puta) ||
		msg.text.toString().toLowerCase().includes(foda) ) {
		bot.sendMessage
		(
			msg.chat.id,
			"😱 Ops, bad language detected! Humans, please excuse " + msg.from.first_name + " for say bad words here.",
			{ parse_mode: "HTML", reply_to_message_id: msg.message_id }
		);
		//Debug
		console.log(msg.from.username + " said bad words!");
	}

	// Mention
	if (msg.text.toString().toLowerCase() === "@mozlovebot") {
		bot.sendMessage
		(
			msg.chat.id,
			"🤖 That's me! Type <code>/help</code> if you need assistence.",
			{ parse_mode: "HTML", reply_to_message_id: msg.message_id }
		);
		//Debug
		console.log(msg.from.username + " called me.");
	}
});

// Mozilla News
bot.onText(/\/mozillanews/i, function (msg, match) {
	var url = "https://blog.mozilla.org/wp-json/wp/v2/posts?per_page=1";
	request({ url: url, json: true }, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			if (body.length != 0) {
				var response = body[0].link;
				bot.sendMessage(msg.chat.id, response, {parse_mode: "HTML", reply_to_message_id: msg.message_id, disable_web_page_preview: false });
				//Debug
				console.log(response);
			} else {
				bot.sendMessage(msg.chat.id, "¯\\_(ツ)_/¯");
			}
		} else {
			//Debug
			console.error(error);
			bot.sendMessage(msg.chat.id, "¯\\_(ツ)_/¯");
		}
	});
	//Debug
	console.log("Bot received a custom command /mozillanews from @" +msg.from.username);
});

// Firefox News
bot.onText(/\/firefoxnews/i, function (msg, match) {
	var url = "https://blog.mozilla.org/firefox/wp-json/wp/v2/posts?per_page=1";
	request({ url: url, json: true }, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			if (body.length != 0) {
				var response = body[0].link;
				bot.sendMessage(msg.chat.id, response, {parse_mode: "HTML", reply_to_message_id: msg.message_id, disable_web_page_preview: false });
				//Debug
				console.log(response);
			} else {
				bot.sendMessage(msg.chat.id, "¯\\_(ツ)_/¯");
			}
		} else {
			//Debug
			console.error(error);
			bot.sendMessage(msg.chat.id, "¯\\_(ツ)_/¯");
		}
	});
	//Debug
	console.log("Bot received a custom command /firefoxnews from @" +msg.from.username);
});

// Hacks News
bot.onText(/\/hacksnews/i, function (msg, match) {
	var url = "https://hacks.mozilla.org/wp-json/wp/v2/posts?per_page=1";
	request({ url: url, json: true }, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			if (body.length != 0) {
				var response = body[0].link;
				bot.sendMessage(msg.chat.id, response, {parse_mode: "HTML", reply_to_message_id: msg.message_id, disable_web_page_preview: false });
				//Debug
				console.log(response);
			} else {
				bot.sendMessage(msg.chat.id, "¯\\_(ツ)_/¯");
			}
		} else {
			//Debug
			console.error(error);
			bot.sendMessage(msg.chat.id, "¯\\_(ツ)_/¯");
		}
	});
	//Debug
	console.log("Bot received a custom command /hacksnews from @" +msg.from.username);
});

// SUMO News
bot.onText(/\/sumonews/i, function (msg, match) {
	var url = "https://blog.mozilla.org/sumo/wp-json/wp/v2/posts?per_page=1";
	request({ url: url, json: true }, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			if (body.length != 0) {
				var response = body[0].link;
				bot.sendMessage(msg.chat.id, response, {parse_mode: "HTML", reply_to_message_id: msg.message_id, disable_web_page_preview: false });
				//Debug
				console.log(response);
			} else {
				bot.sendMessage(msg.chat.id, "¯\\_(ツ)_/¯");
			}
		} else {
			//Debug
			console.error(error);
			bot.sendMessage(msg.chat.id, "¯\\_(ツ)_/¯");
		}
	});
	//Debug
	console.log("Bot received a custom command /sumonews from @" +msg.from.username);
});

// L10n News
bot.onText(/\/l10nnews/i, function (msg, match) {
	var url = "https://blog.mozilla.org/l10n/wp-json/wp/v2/posts?per_page=1";
	request({ url: url, json: true }, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			if (body.length != 0) {
				var response = body[0].link;
				bot.sendMessage(msg.chat.id, response, {parse_mode: "HTML", reply_to_message_id: msg.message_id, disable_web_page_preview: false });
				//Debug
				console.log(response);
			} else {
				bot.sendMessage(msg.chat.id, "¯\\_(ツ)_/¯");
			}
		} else {
			//Debug
			console.error(error);
			bot.sendMessage(msg.chat.id, "¯\\_(ツ)_/¯");
		}
	});
	//Debug
	console.log("Bot received a custom command /l10nnews from @" +msg.from.username);
});

// Reps News
bot.onText(/\/repsnews/i, function (msg, match) {
	var url = "https://blog.mozilla.org/mozillareps/wp-json/wp/v2/posts?per_page=1";
	request({ url: url, json: true }, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			if (body.length != 0) {
				var response = body[0].link;
				bot.sendMessage(msg.chat.id, response, {parse_mode: "HTML", reply_to_message_id: msg.message_id, disable_web_page_preview: false });
				//Debug
				console.log(response);
			} else {
				bot.sendMessage(msg.chat.id, "¯\\_(ツ)_/¯");
			}
		} else {
			//Debug
			console.error(error);
			bot.sendMessage(msg.chat.id, "¯\\_(ツ)_/¯");
		}
	});
	//Debug
	console.log("Bot received a custom command /repsnews from @" +msg.from.username);
});
