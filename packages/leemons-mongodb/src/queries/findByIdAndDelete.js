const { findOneAndDelete } = require('./findOneAndDelete');

function findByIdAndDelete({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}) {
  return async function () {
    const [id, ...args] = arguments;
    return findOneAndDelete({
      model,
      modelKey,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ignoreTransaction,
      ctx,
    })({ id }, ...args);
  };
}

module.exports = { findByIdAndDelete };
