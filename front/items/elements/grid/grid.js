elements.ItemAdd({
	id: 'audit-grid',
	icon: 'history',
	name: 'Audit Grid',
	description: 'Grid of the latest command runs with who ran them, from where and how they went.',
	category: 'Audit',
	collection: 'Home',
	author: 'OneType',
	metadata: { addon: 'audit.commands' },
	config: {
		background: {
			type: 'number',
			value: 1,
			options: [0, 1, 2, 3],
			description: 'Background depth of the grid, 0 renders transparent.'
		},
		limit: {
			type: 'number',
			value: 100,
			description: 'How many of the latest runs to show.'
		}
	},
	render: function()
	{
		this.rows = [];

		this.fields = [
			{ key: 'date', label: 'When', type: 'text', width: '160px' },
			{ key: 'command', label: 'Command', type: 'text', width: '1.5fr' },
			{ key: 'user', label: 'User', type: 'text', width: '120px' },
			{ key: 'status', label: 'Status', type: 'status', width: '120px' },
			{ key: 'duration', label: 'Time', type: 'number', width: '100px' }
		];

		this.status = (code) =>
		{
			if(code >= 200 && code < 300)
			{
				return { label: String(code), color: 'green' };
			}

			return { label: String(code), color: code >= 500 ? 'red' : 'orange' };
		};

		this.refresh = async () =>
		{
			const result = await $ot.command('database:find', {
				addon: 'audit.commands',
				sort_field: 'id',
				sort_direction: 'desc',
				limit: this.limit
			}, true);

			if(result.code !== 200)
			{
				return;
			}

			this.rows = result.data.items.map((entry) => ({
				id: entry.id,
				date: new Date(entry.created_at).toLocaleString(),
				command: entry.command,
				user: entry.direct ? 'system' : (entry.user_id ? '#' + entry.user_id : 'anonymous'),
				status: this.status(entry.code),
				duration: entry.time + 'ms'
			}));
		};

		this.refresh();

		return /* html */ `
			<e-views-grid :fields="fields" :items="rows" :background="background" empty="No runs recorded yet."></e-views-grid>
		`;
	}
});
