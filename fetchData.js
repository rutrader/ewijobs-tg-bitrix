require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const listUrl = `${process.env.BITRIX_REST_URL}crm.lead.list.json`
const updatUrl = `${process.env.BITRIX_REST_URL}crm.lead.update.json`

let leads = [];

const headers = { 'Content-Type': 'application/json; charset=UTF-8' };

const getJobReply = async () => {
	return fetch(listUrl, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			'SELECT': ['ID', 'TITLE', 'COMMENTS'],

			'FILTER': {
				'ID': [288277],
			}
		})
	})
		.then(response => response.json())
		.then(data => {
			if (data.total !== undefined && data.total > 0) {
				leads.push(data.result)
			}
		})
}

const update = async (id) => {
	return fetch(updatUrl, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			'id': id,
			'fields': {
				COMMENTS: 'jooble'
			}
		})
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(response.status)
			}

			return response.json()
		})
}

fetchAndUpdate = async () => {
	getJobReply()
		.then(() => {
			return leads.shift()
		})
		.then((leads) => {
			leads.map(lead => {
				try {
					update(lead.ID)
						.then(data => console.log(data))
						.catch(err => console.error(err))
				} catch (err) {
					console.error(`Something went wrong: ${err}`)
				}
			})
		})
}

fetchAndUpdate()