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
    unknownError: 3
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
    
            const ofCollection = await this.retrieve(req)
    
            if(!ofCollection) {
                this.handleError(errorCodes.notFoundError, res)
                return { success: false, data: null, error: `No document found.` }
            }
            return { success: true, data: ofCollection, error: null }
        }
        catch (error) {
            return this.handleError(errorCodes.unknownError, res, error)
        }
    }
}

function initialiseRetriever(validator, fetcher, errorHandler) {
    return function(collection, fieldsDesired = '') {
        const retriever = Object.assign(retrieverProto, validator, fetcher, errorHandler)

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
            console.log(res.fetcherData)
            console.log(this.collection.modelName)
            break;
            case errorCodes.validationError:
            printError('Validation error')
            console.log(error)
            break;
            case errorCodes.unknownError:
            printError('Unknown error')
            console.log(error)
            break;
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