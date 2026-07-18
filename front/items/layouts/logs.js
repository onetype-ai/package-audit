onetype.AddonReady('ui.layouts', (layouts) =>
{
	layouts.Item({
		id: 'audit-logs',
		isActive: true,
		condition: { app: ['audit'], mode: ['logs'] },
		zone: 'root',
		slot: 'center',
		render: function()
		{
			return /* html */ `<e-audit-grid :background="0"></e-audit-grid>`;
		}
	});
});
