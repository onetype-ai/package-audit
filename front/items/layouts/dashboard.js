onetype.AddonReady('ui.layouts', (layouts) =>
{
	layouts.Item({
		id: 'audit-dashboard',
		isActive: true,
		condition: { app: ['audit'], mode: ['dashboard'] },
		zone: 'root',
		slot: 'center',
		render: function()
		{
			return /* html */ `<e-dashboard pattern="dots"></e-dashboard>`;
		}
	});
});
