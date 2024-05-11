/* eslint-disable no-param-reassign */

const paginate = (schema) => {
    /**
     * @typedef {Object} QueryResult
     * @property {Document[]} results - Results found
     * @property {number} page - Current page
     * @property {number} limit - Maximum number of results per page
     * @property {number} totalPages - Total number of pages
     * @property {number} totalResults - Total number of documents
     */
    /**
     * Query for documents with pagination
     * @param {Object} [filter] - Mongo filter
     * @param {Object} [options] - Query options
     * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @returns {Promise<QueryResult>}
     */
    schema.statics.paginate = async function (
      filter,
      options,
      populateArray = []
    ) {
      // //console.log("\n\n\n populateArray = ", populateArray)
      // let sort = '';
      let sort = {}
      let proj = {};
      // if (options.sortBy) {
      //   const sortingCriteria = [];
      //   options.sortBy.split(',').forEach((sortOption) => {
      //     const [key, order] = sortOption.split(':');
      //     sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      //   });
      //   sort = sortingCriteria.join(' ');
      // } else {
      //   sort = { _id: -1 };
      // }
  
      if (options.sortBy) {
        const [key, order] = options.sortBy.split(':');
          sort[key]=1
          if(order==='desc'){
            sort[key]=-1
          }
      } else {
        sort = { _id: -1 };
      }
      
      if (options.select) {
        proj = options.select;
      }
  
      const limit =
        options.limit && parseInt(options.limit, 10) > 0
          ? parseInt(options.limit, 10)
          : 10;
      const page =
        options.page && parseInt(options.page, 10) > 0
          ? parseInt(options.page, 10)
          : 1;
      const skip = (page - 1) * limit;
  
      const countPromise = this.countDocuments(filter).exec();
      const docsPromise = this.find(filter)
        .select(proj)
        .populate(populateArray)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();
  
      return Promise.all([countPromise, docsPromise]).then((values) => {
        const [totalResults, results] = values;
        const totalPages = Math.ceil(totalResults / limit);
        const result = {
          results,
          page,
          limit,
          totalPages,
          totalResults,
        };
        return Promise.resolve(result);
      });
    };
  };
  
  module.exports = paginate;
  