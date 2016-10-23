#!/usr/bin/env node

var
	dot     = require('dot'),
	fs      = require('fs'),
	Podcast = require('podcast'),
	toml    = require('toml')
	;

dot.templateSettings.strip = false;
var feedOptions = toml.parse(fs.readFileSync('./src/metadata.toml', 'utf8'));
var feed = new Podcast(feedOptions);
var templatefn = dot.template(fs.readFileSync('./src/template.html'));

var shows = fs.readdirSync('./src/sets/');
shows.forEach(function handleShow(s)
{
	if (!s.endsWith('.toml')) return;

	var obj = toml.parse(fs.readFileSync(`src/sets/${s}`, 'utf8'));
	feed.item(obj);
	var txt = templatefn(obj);
	fs.writeFileSync(`output/${s.replace(/\.toml$/, '')}.html`, txt, 'utf8');
});

fs.writeFileSync('./output/feed.rss', feed.xml('\t'), 'utf8');
