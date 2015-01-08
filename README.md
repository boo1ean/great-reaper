## Great reaper

`great-reaper` is targeted to scrap collections of data from web pages with usage of friendly jquery-like (css) selectors for describing scrap strategy.

## Installation

```
npm install great-reaper
```

## Examples

Get top 3 hacker news:

```js
reap('https://news.ycombinator.com/')
	.group('table tr:nth-child(3) table tr')
	.map({
		title: '.title a',
		url: '.title a@href'
	})
	.limit(3)
	.then(console.log);
```

results

```js
[ { title: 'Engineer Anti-Patterns',
    url: 'http://dtrace.org/blogs/eschrock/2012/08/14/engineer-anti-patterns/' },
  { title: 'Hotel Wi-Fi blocking: Marriott is bad, and should feel bad',
    url: 'http://www.economist.com/blogs/gulliver/2015/01/hotel-wi-fi-blocking' },
  { title: 'Can\'t you just turn up the volume?',
    url: 'https://medium.com/@Amp/cant-you-just-turn-up-the-volume-4ecb7fc422a' } ]
```

## LICENSE

MIT
