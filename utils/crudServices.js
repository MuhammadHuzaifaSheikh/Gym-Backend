// const { NotFoundError } = require('./graphql.error');
// const { ConfigListing } = require('../models')

/**
 * Create a record
 * @param {Object} modelBody
 * @returns {Promise<Model>}
 */
const create = async (model, body) => {
  return await model.create(body);
};

/**
 * Get records
 * @param {Object} model - Model name
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getList = async (model, filter, options, populateArray = []) => {
  return await model.paginate(filter, options, populateArray);
};

/**
 * Retrieves a list of items based on the specified configuration.
 *
 * @param {Object} model - The model object or reference used for database operations.
 * @param {Object} filter - The filtering criteria for the database query.
 * @param {Object} options - Additional options or settings for the query.
 * @param {Array} [populateArray=[]] - An array of fields or references to populate in the query result. (Optional)
 * @param {string} type - The type or category associated with the query.
 * @param {string} userId - The ID of the user.
 * @returns {Promise} A promise that resolves with the retrieved list of items.
 */
// const getListWithConfig = async (model, filter, options, type, userId, populateArray = []) => {

//   let returnData = {
//     config: {
//       limit: options.limit,
//       page: options.page,
//       totalPages: 0,
//       totalResults: 0,
//       no_of_records: 0,
//       type: '',
//       columns: []
//     },
//     results: []
//   }
//   let confiListing = await ConfigListing.find({
//     type: type,
//     $or: [
//       { User: userId },
//       { User: { $exists: false } },
//       { User: null }
//     ]
//   });
//   //  if user record not found return default config listing
//   if (confiListing.length === 1) {
//     confiListing = confiListing.find(record => !record.user)
//   } else if (confiListing.length > 1) {
//     confiListing = confiListing.find(record => record.User == userId)
//   }
//   if(confiListing.no_of_records) {
//     options['limit'] = confiListing.no_of_records
//   }
//   else if(!options.limit || options.limit === undefined){  
//     if (confiListing && confiListing.no_of_records) {
//     options['limit'] = confiListing.no_of_records
//   }
// }

//   let result = await model.paginate(filter, options, populateArray);

//   if (result) {
//     let results = result.results
//     delete result['results']

//     returnData['config'] = result;

//     returnData['config']['no_of_records'] = confiListing?confiListing.no_of_records:null
//     returnData['config']['type'] = confiListing?confiListing.type:null
//     returnData['config']['columns'] = confiListing?confiListing.columns:null
//     returnData['results'] = results
//   }
//   return returnData;
// };

const getAll = async (model, filter = {}, option = {}, populate = []) => {
  return await model.find(filter, option).populate(populate).exec();
};

const getAllWithSort = async (model, filter = {}, option = {},sortBy={created_at:1}, populate = []) => {
  return await model.find(filter, option).populate(populate).sort(sortBy).exec();
};
/**
 * Get records
 * @param {Object} model - Model name
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getListByFilter = async (
  model,
  filter,
  options,
  populate = [],
  limit = 30,
  skip = 0,
  sort = {}
) => {
  return await model
    .find(filter, options)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

/**
 * Get by id
 * @param {ObjectId} id
 * @returns {Promise<Model>}
 */
const getById = async (model, id, select = {}, populate = []) => {
  return model.findById(id).select(select).populate(populate);
};

/**
 * Get by ids
 * @param {ObjectIdList} idList
 * @returns {Promise<[Model]>}
 */
const getByIds = async (model, idList) => {
  return model.find({
    _id: { $in: idList },
  });
};

/**
 * Update by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<model>}
 */
const updateById = async (model, id, updateBody) => {
  const result = await getById(model, id);
  if (!result) {
    throw new Error('Data not found');
  }
  Object.assign(result, updateBody);
  await result.save();
  return result;
};

/**
 * Delete by id
 * @param {ObjectId} Id
 * @returns {Promise<Model>}
 */
const deleteById = async (model, id) => {
  const result = await getById(model, id);
  if (!result) {
    throw new Error('Data not found');
  }
  result['is_deleted'] = true;
  await updateById(model, id, result);
  return result;
};

const getOne = async (model, cond, proj = {}, sort = {}, populate = []) => {
  return await model.findOne(cond, proj).sort(sort).populate(populate).exec();
};

/**
 * Finds distinct '_id' values of Model documents based on a search pattern.
 *
 * @param {string} search - The search pattern to match against the 'name' field.
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of distinct '_id' values.
 */

const findDistinctIdsBySearch = async (model, query) => {
  // Use a regular expression with a case-insensitive search to match the 'name' field
  const models = await model.find(query).distinct('_id').exec();

 return models; // Return the array of distinct '_id' values
};

// const findDistinctIdsBySearch = async (model, search) => {
//      // Use a regular expression with a case-insensitive search to match the 'name' field
//      const models = await model.find(
//       {
//       'name': { $regex: `.*${search}.*`, $options: 'i' }
//     }).distinct('_id').exec();

//     return models; // Return the array of distinct '_id' values
// };

module.exports = {
  create,
  getList,
  getById,
  updateById,
  deleteById,
  getListByFilter,
  getOne,
  getByIds,
  getAll,
  // getListWithConfig,
  getAllWithSort,
  findDistinctIdsBySearch
};
