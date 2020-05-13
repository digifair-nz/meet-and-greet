const test = require('../validation')
const errorCodes = require('./errorCodes')

const validators = require('./validators')
const fetchers = require('./fetchers')
const errorHandlers = require('./errorHandlers')
const mutators = require('./mutators')
const mutationValidators = require('./mutation_validators')

const mongoose = require('mongoose')
const Company = mongoose.model('Company')
const Queue = mongoose.model('Queue')
const User = mongoose.model('User')

const retrieverProto = {
    from: async function from(req, res) {
        try {
            const validationResult = this.validate(req)
            if(!validationResult.success) {
                this.handleError(errorCodes.validationError, res, validationResult.error)
                return validationResult
            }
            
            if(this.mutate && this.mutationValidate) {
                const mutationValidationResult = this.mutationValidate(req)
                if(!mutationValidationResult.success) {
                    this.handleError(errorCodes.mutationValidationError, res, mutationValidationResult.error)
                }
            }
            const ofCollection = await this.retrieve(req)
            
            if(ofCollection == undefined || Array.isArray(ofCollection) && !ofCollection.length) {
                this.handleError(errorCodes.notFoundError, res)
                return { success: false, data: null, error: `No document found.` }
            }

            if(this.mutate) {
                const mutationResult = await this.mutate(ofCollection, req)
                if(!mutationResult.success) {
                    this.handleError(errorCodes.mutationError, res, mutationResult.error)
                    return mutationResult
                }
                try {
                    await ofCollection.save()
                }
                catch (error) {
                    this.handleError(errorCodes.mutationSaveError, res, error)
                    return { success: false, data: null, error: `Mutation save error`}
                }
            }
            return { success: true, data: ofCollection, error: null }
        }
        catch (error) {
            this.handleError(errorCodes.unknownError, res, error)
            return { success: false, data: null, error }
        }
    }
}

/**
 * Function to create a retriever object used to access the database
 * @param {{ validator, fetcher, errorHandler, mutator, mutatorValidator }} options The components to fit together to create the retriever object. mutator, mutatorValidator, and verifier are optional. The validator object is responsible for validating the query to ensure that it is a valid query. The fetcher is responsbile for making the query. The errorHandler is expected to manage any errors which may occur. The mutator performs mutations on the object fetched by the fetcher and the mutatorValidator validates the mutation query.
 */
function initialiseRetriever(options) {
    if(!options.validator || !options.fetcher) throw new Error('Missing argument')

    return function(collection, fieldsDesired = '') {
        const { validator, fetcher, mutator, mutatorValidator } = options
        const errorHandler = options.errorHandler || errorHandlers.logger

        const retriever = {
            ...retrieverProto, ...validator, ...fetcher, ...errorHandler, ...mutator || {}, ...mutatorValidator || {}
        }

        retriever.collection = collection
        retriever.fieldsDesired = fieldsDesired

        return retriever
    }
}

const idRetriever = initialiseRetriever({
    validator: validators.paramIsId,
    fetcher: fetchers.byId,
})
const idsRetriever = initialiseRetriever({
    validator: validators.bodyHasIds,
    fetcher: fetchers.byIds
})

const enqueueStatusRetriever = initialiseRetriever({
    validator: validators.paramIsId,
    fetcher: fetchers.byEventAndCompany,
    mutator: mutators.enqueue
})

const enqueueAllStatusRetriever = initialiseRetriever({
    validator: validators.paramIsId,
    fetcher: fetchers.allByEventAndCompany,
    mutator: mutators.enqueue
})

const dequeueStatusRetriever = initialiseRetriever({
    validator: validators.paramIsId,
    fetcher: fetchers.byEventAndCompany,
    mutator: mutators.dequeue
})

const byEventByCompanyRetriever = initialiseRetriever({
    validator: validators.paramIsId,
    fetcher: fetchers.byEventAndCompany
})

module.exports = {
    companyById: idRetriever(Company),
    usersByIds: idsRetriever(User),
    enqueueStatus: enqueueStatusRetriever(Queue, 'data'),
    enqueueAllStatus: enqueueAllStatusRetriever(Queue, 'data'),
    dequeueStatus: dequeueStatusRetriever(Queue, 'data'),
    queue: byEventByCompanyRetriever(Queue)
}