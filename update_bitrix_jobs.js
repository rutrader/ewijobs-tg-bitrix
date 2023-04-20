const fs = require('fs');

const getUtmSource = (url) => new URLSearchParams(url.search).get('utm_source') ?? '';

function readFile(filename) {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(JSON.parse(data))
			}
		});
	});
}

function writeFile(filename, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filename, JSON.stringify(data, null, "\t"), err => {
			if (err) {
				reject(err)
			} else {
				resolve();
			};
		});
	});
}

readFile('./tg_jobs.json')
	.then(dataJson => {
		let links = [];

		dataJson.messages.map((message, key) => {
			let link = message.text_entities.filter(item => item.type === 'text_link').shift();

			if (link && getUtmSource(new URL(link.href)) !== '') {
				links.push({
					id: message.id,
					link: link.href,
				})
			}
		});

		return writeFile('./bitrix.json', { links })
	})
	.then(() => console.log('Done'))
	.catch(err => console.error(err))

