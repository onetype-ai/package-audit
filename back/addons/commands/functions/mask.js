import audit from '#audit/addon.js';

audit.commands.Fn('mask', function(value)
{
	const text = String(value);

	if(text.length <= 5)
	{
		return '•••';
	}

	const rest = Buffer.byteLength(text) - 5;

	return text.slice(0, 5) + '… +' + (rest >= 1024 ? (rest / 1024).toFixed(1) + 'kb' : rest + 'b');
});
