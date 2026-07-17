onetype.AddonReady('ui.layouts', (layouts) =>
{
	layouts.Item({
		id: 'audit',
		isActive: true,
		condition: { app: ['audit'] },
		zone: 'root',
		slot: 'center',
		render: function()
		{
			return /* html */ `<e-dashboard pattern="dots"></e-dashboard>`;
		}
	});
});
