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

module.exports = {
    paramIsId: paramIdValidator
}