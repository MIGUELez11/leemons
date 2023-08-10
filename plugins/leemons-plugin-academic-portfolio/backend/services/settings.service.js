/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const restActions = require('./rest/settings.rest');
const { setProfiles, getProfiles } = require('../core/settings');
const enableAllMenuItems = require('../core/menu-builder/enableAllItems');

/** @type {ServiceSchema} */
module.exports = {
  name: 'academic-portfolio.settings',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    setProfiles: {
      handler(ctx) {
        return setProfiles({ ...ctx.params, ctx });
      },
    },
    getProfiles: {
      handler(ctx) {
        return getProfiles({ ctx });
      },
    },
    enableAllMenuItems: {
      handler() {
        return enableAllMenuItems();
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
