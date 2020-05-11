const test = require('./validation')

const mongoose = require('mongoose')
const Company = mongoose.model('Company')
const Queue = mongoose.model('Queue')

// validation
// error on validation
// fetching the document
// checking if the document exists
// returning the document / doing something with the document

const errorCodes = Object.freeze({
    validationError: 1,
    notFoundError: 2,
    unknownError: 3,
    mutationValidationError: 4,
    mutationError: 5
})

const printError = arg => console.log(`\x1b[33m%s\x1b[0m`, arg)

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
    
            if(!ofCollection) {
                this.handleError(errorCodes.notFoundError, res)
                return { success: false, data: null, error: `No document found.` }
            }

            if(this.mutate) {
                const mutationResult = this.mutate(ofCollection, req)
                if(!mutationResult.success) {
                    this.handleError(errorCodes.mutationError, res, mutationResult.error)
                    return mutationResult
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

function initialiseRetriever(validator, fetcher, errorHandler, mutator, mutatorValidator) {
    return function(collection, fieldsDesired = '') {
        const retriever = Object.assign(retrieverProto, validator, fetcher, errorHandler, mutator || {}, mutatorValidator || {})

        retriever.collection = collection
        retriever.fieldsDesired = fieldsDesired

        return retriever
    }
}

const paramIdValidator = {
    validate: function validate(req) {
        if(test.isId({ _id: req.params._id })) {
            if(!req.fetcherData) req.fetcherData = {}
            req.fetcherData._id = req.params._id
            return { success: true, error: null }
        }
        else {
            return { success: false, error: `Invalid id: ${req.params._id}` }
        }
    }
}
const idFetcher = {
    retrieve: async function retrieve(req) {
        return this.collection.findById(req.fetcherData._id)
    }
}
const loggerErrorHandler = {
    handleError: function handleError(errorCode, res, error) {
        switch (errorCode) {
            case errorCodes.notFoundError:
            printError('Not found error')
            return;
            case errorCodes.validationError:
            printError('Validation error')
            break;
            case errorCodes.unknownError:
            printError('Unknown error')
            break;
            case errorCodes.mutationValidationError:
            printError('Mutation validation error')
            break;
            case errorCodes.mutationError:
            printError('Mutation error')
            break;
        }
        if(errorCode == errorCodes.notFoundError) {
            console.log(res.fetcherData)
            console.log(this.collection.modelName)
        }
        else {
            console.log(error)
        }
    }
}

// function getById(collection) {
//     return async function(req, res, _id, fieldsDesired = '') {
//         try {
//             const _idToSearchWith = _id || req.body._id
//             if(!validate.isId({ _id: _idToSearchWith })) {
//                 return res.status(400).json({ message: `Invalid id: ${_idToSearchWith}`})
//             }

//             const ofCollection = await collection.findById(_id || req.body._id, fieldsDesired)
//             if(!ofCollection) return res.status(404).json({ message: `Unable to find the ${collection.modelName} with the id ${_id}` })

//             // req[collection.modelName] = ofCollection
//             return ofCollection
//         }
//         catch (err) {
//             return err
//         }
//     }
// }
// function getByQuery(collection) {
    
// }

const idRetriever = initialiseRetriever(paramIdValidator, idFetcher, loggerErrorHandler)

module.exports = {
    companyById: idRetriever(Company)
}