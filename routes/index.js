const google = require('googleapis');
var express = require('express');
var router = express.Router();

async function authorize() {
	const auth = await google.google.auth.getClient({
		scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
	});
	return auth;
}

const createLeadObject = (headers, leadData) => {
	leadObject = {};
	headers.forEach((header, i) => {
		leadObject[header] = leadData[i] || '';
	});
	return leadObject;
};

/* GET home page. */
router.get('/:sheetid/:email', function(req, res, next) {
	authorize().then(auth => {
		const sheetid = req.params.sheetid;
		const email = req.params.email;
		const sheets = google.google.sheets({ version: 'v4', auth });
		sheets.spreadsheets.values.get(
			{
				spreadsheetId: sheetid,
				range: 'API!A1:Z1000',
			},
			(err, data) => {
				if (err) return console.log('shits fucked yo', err);
				const headerRow = data.data.values[0];
				const personRow = data.data.values.filter(row => {
					return row[0] === email;
				});
				const personObject = createLeadObject(headerRow, personRow[0]);
				res.send(personObject);
			}
		);
	});
});

module.exports = router;
