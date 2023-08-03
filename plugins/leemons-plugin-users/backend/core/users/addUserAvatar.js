async function addUserAvatar({ user, avatar, ctx } = {}) {
  const assetData = {
    indexable: false,
    public: true,
    name: `user-${user.id}`,
  };
  if (avatar) assetData.cover = avatar;
  let asset;
  if (user.avatarAsset) {
    // TODO migration: Cuando se acabe de migrar el servicio de leebrary descomentar la llamada
    /*
      asset = await ctx.tx.call('leebrary.assets.update', {
        data: { ...assetData, id: user.avatarAsset },
        published: true,
      });
    */
  } else {
    // TODO migration: Cuando se acabe de migrar el servicio de leebrary descomentar la llamada
    /*
      asset = await ctx.tx.call('leebrary.assets.add', {
        data: assetData,
        published: true,
      });
    */
  }

  // TODO migration: Quitar mock
  const coverUrl = 'http://google.es/foto';
  // ? Sería necesario meter await
  /*
    const coverUrl = ctx.tx.call('leebrary.assets.getCoverUrl', asset.id);
  */

  const u = await ctx.tx.db.Users.findOneAndUpdate(
    { id: user.id },
    {
      avatar: `${coverUrl}?t=${Date.now()}`,
      avatarAsset: asset.id,
    },
    {
      new: true,
    }
  );

  return {
    ...u,
    avatar: coverUrl,
  };
}

module.exports = { addUserAvatar };
