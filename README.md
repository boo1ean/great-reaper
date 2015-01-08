## Great reaper

`great-reaper` is targeted to scrap collections of data from web pages with usage of friendly jquery-like (css) selectors for describing scrap strategy.

## Installation

```
npm install great-reaper
```

## Usage

```js
reap('https://news.ycombinator.com/')
	.group('table table tr td:nth-child(3)')
	.map({
		title: '.title a'
	})
	.then(function (data) {
		console.log(data, 'done');
	});
```

## LICENSE

MIT
