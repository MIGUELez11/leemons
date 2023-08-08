const _ = require('lodash');
const { getUserProgramIds } = require('../../programs/getUserProgramIds');
const { getProfiles } = require('../../settings');

async function removeCustomPermissions({ studentId, programId, ctx }) {
  const programs = await getUserProgramIds({
    userSession: { userAgents: [{ id: studentId }] },
    ctx,
  });
  if (programs.length) {
    const programsIds = _.map(programs, 'id');
    if (!programsIds.includes(programId)) {
      await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
        userAgentId: studentId,
        data: {
          permissionName: `plugins.academic-portfolio.program.inside.${programId}`,
        },
      });
      const { student: studentProfileId } = await getProfiles({ ctx });

      await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
        userAgentId: studentId,
        data: {
          permissionName: `plugins.academic-portfolio.program-profile.inside.${programId}-${studentProfileId}`,
        },
      });
    }
  }
}

module.exports = { removeCustomPermissions };
