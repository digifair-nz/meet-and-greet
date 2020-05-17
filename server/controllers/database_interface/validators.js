const test = require('../validation')

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

const bodyHasIdsValidator = {
    validate: function validate(req) {
        if(test.isIdArray(req.body._ids)) {
            if(!req.fetcherData) req.fetcherData = {}
            req.fetcherData._ids = req.body._ids
            return { success: true, error: null }
        }
        else {
            return { success: false, error: `At least one id is invalid: ${req.body._ids}`}
        }
    }
}

module.exports = {
    paramIsId: paramIdValidator,
    bodyHasIds: bodyHasIdsValidator
}