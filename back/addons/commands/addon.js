import onetype from '@onetype/framework';

onetype.AddonReady('audit', (audit) =>
{
	audit.commands = onetype.Addon('audit.commands', (addon) =>
	{
		addon.Table('audit_commands');

		addon.Field('id', {
			type: 'string',
			description: 'Unique row id, a bigint the database returns as a string.'
		});

		addon.Field('command', {
			type: 'string',
			required: true,
			description: 'Id of the command that ran, like vault:keys:set.'
		});

		addon.Field('input', {
			type: 'object',
			value: {},
			description: 'Input properties of the run, with sensitive fields redacted.'
		});

		addon.Field('code', {
			type: 'number',
			description: 'Status code of the result, HTTP style.'
		});

		addon.Field('message', {
			type: 'string',
			description: 'Result message of the run.'
		});

		addon.Field('time', {
			type: 'number',
			description: 'Execution duration in milliseconds.'
		});

		addon.Field('user_id', {
			type: 'string',
			description: 'Id of the signed in user, null for anonymous or internal runs.'
		});

		addon.Field('ip', {
			type: 'string',
			description: 'Remote address the run came from, empty for internal runs.'
		});

		addon.Field('direct', {
			type: 'boolean',
			value: false,
			description: 'Whether the run was a trusted internal call that skipped the condition.'
		});

		addon.Field('created_at', {
			type: 'string',
			description: 'Timestamp of the run.'
		});

		addon.Schema('id bigserial primary key');
		addon.Schema('command varchar(255) not null');
		addon.Schema('input jsonb not null default \'{}\'');
		addon.Schema('code integer');
		addon.Schema('message text');
		addon.Schema('time real');
		addon.Schema('user_id bigint');
		addon.Schema('ip varchar(45)');
		addon.Schema('direct boolean not null default false');
		addon.Schema('created_at timestamptz not null default now()');

		addon.Expose({
			filter: ['command', 'code', 'user_id', 'direct', 'created_at'],
			sort: ['id', 'created_at', 'time', 'code', 'command'],
			select: ['id', 'command', 'input', 'code', 'message', 'time', 'user_id', 'ip', 'direct', 'created_at'],
			find: function()
			{
				return this.http && this.http.state.user ? true : 'Sign in to view the audit log.';
			}
		});
	});
});
