#!/usr/bin/env node

var
	fs      = require('fs'),
	Podcast = require('podcast'),
	toml    = require('toml')
	;

var feedOptions = toml.parse(fs.readFileSync('./src/metadata.toml', 'utf8'));
var feed = new Podcast(feedOptions);

// read shows in directory

var shows = fs.readdirSync('./src/sets/');
shows.forEach(function handleShow(s)
{
	if (!s.endsWith('.toml')) return;

	var obj = toml.parse(fs.readFileSync(`src/sets/${s}`, 'utf8'));
	feed.item(obj);
});

fs.writeFileSync('./feed.rss', feed.xml('\t'), 'utf8');
