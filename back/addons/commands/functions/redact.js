import audit from '#audit/addon.js';

const SENSITIVE = ['password', 'value', 'secret', 'token'];

audit.commands.Fn('redact', function(input)
{
	if(!input || typeof input !== 'object')
	{
		return {};
	}

	const result = {};

	for(const [key, value] of Object.entries(input))
	{
		result[key] = SENSITIVE.includes(key.toLowerCase()) && value != null ? this.Fn('mask', value) : value;
	}

	return result;
});
