import onetype from '@onetype/framework';
import commands from '@onetype/framework/commands';
import audit from '#audit/addon.js';

onetype.EmitOn('@commands.run', (run) =>
{
	const command = commands.ItemGet(run.id);

	if(command && command.Get('silent'))
	{
		return;
	}

	audit.commands.Fn('record', run).catch(() => null);
});
