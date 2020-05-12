const idFetcher = {
    retrieve: async function(req) {
        return this.collection.findById(req.fetcherData._id, this.fieldsDesired)
    }
}
const byEventAndCompanyFetcher = {
    retrieve: async function(req) {
        return this.collection.findOne({ eventId: req.payload.eventId, companyId: req.params._id })
    }
}

module.exports = {
    byId: idFetcher,
    byEventAndCompany: byEventAndCompanyFetcher
}