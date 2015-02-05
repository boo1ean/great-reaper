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

## Filters

Filters allows you to filter out redundant items from collection

```js
	...
	.filter(function (item) {
		return item.type === 'good';
	})
	...
```

property specific filters:

```js
	...
	.filter({
		type: function (type) {
			return type === 'good';
		}
	})
	...
```

## Transforms

Get hot questions from stackoverflow with urls.

Initially question links are relative so we should make them absolute to get correct urls.

```js
reap('http://stackoverflow.com/?tab=hot')
	.group('.question-summary')
	.map({
		question: '.question-hyperlink',
		url: '.question-hyperlink@href',
		views: '.views .mini-counts'
	})
	.transform({
		question: reap.t().lowercase(),
		url: reap.t.().prefix('http://stackoverflow.com'),
		views: reap.t.().int()
	})
	.then(console.log);
```

results

```js
[ { question: 'program breaks from switch java',
    url: 'http://stackoverflow.com/questions/27840619/program-breaks-from-switch-java',
    views: 49 },
  { question: 'what is the z at the end of date',
    url: 'http://stackoverflow.com/questions/27840670/what-is-the-z-at-the-end-of-date',
    views: 28 },
  { question: 'convert array of objects into object',
    url: 'http://stackoverflow.com/questions/27840109/convert-array-of-objects-into-object',
    views: 18 }, .... ]
```

Also you can chain transforms

```js
	...
	.transform({
		summary: reap.t().lowercase().trim()
	})
	...
```

## Transforms

`reap.transforms` contains basic transforms functions

#### reap.t().tream()

Tream field value

#### reap.t().prefix(string)

Prepend string to field value

#### reap.t().postfix(string)

Append string to field value

#### reap.t().lowercase()

Lowercase field value

#### reap.t().slice(from, to)

Slices field value same as `string.slice`

#### reap.t().split(separator)

Split string using given separator and returns array

#### reap.t().join(glue)

Joins array using given glue and returns string

#### reap.t().int()

Typecase field value to `int`

#### reap.t().float()

Typecase field value to `float`

## Custom transforms

You can use custom transform function:

```js
	...
	.transform(function (item) {
		if (item.type === 'good') {
			item.status = 'good item';
		}

		return item;
	})
	...
```

Or apply transform for specific field

```js
	...
	.transform({
		status: function (val) {
			return 'status: ' + val.toLowerCase();
		}
	})
	...
```

## LICENSE

MIT
