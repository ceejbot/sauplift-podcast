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
var templatefn = dot.template(fs.readFileSync('./src/item.tmpl.html'));

feedOptions.sets = [];

var shows = fs.readdirSync('./src/sets/');
shows.forEach(function handleShow(s)
{
	if (!s.endsWith('.toml')) return;
	var setslug = s.replace(/\.toml$/, '');
	console.log(setslug);

	var obj = toml.parse(fs.readFileSync(`src/sets/${s}`, 'utf8'));
	feed.item(obj);
	var txt = templatefn(obj);
	fs.writeFileSync(`output/${setslug}.html`, txt, 'utf8');
	feedOptions.sets.push({slug: setslug, title: obj.title });
});

fs.writeFileSync('./output/feed.rss', feed.xml('\t'), 'utf8');

var indexfn = dot.template(fs.readFileSync('./src/index.tmpl.html'));
var txt = indexfn(feedOptions);
fs.writeFileSync('output/index.html', txt, 'utf8');

console.log('Done. Now rsync.');
