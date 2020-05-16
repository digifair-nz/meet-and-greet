const idFetcher = {
    retrieve: function(req) {
        return this.collection.findById(req.fetcherData._id, this.fieldsDesired)
    }
}
const idsFetcher = {
    retrieve: function(req) {
        return this.collection.find({
            '_id': {
                $in: req.fetcherData._ids
            }
        }, this.fieldsDesired)
    }
}

const byEventAndCompanyFetcher = {
    retrieve: async function(req) {
        const data = await this.collection.find({})
        return this.collection.findOne({ eventId: req.payload.eventId, companyId: req.params._id })
    }
}
const allByEventAndCompanyFetcher = {
    retrieve: function(req) {
        return this.collection.find({ eventId: req.payload.eventId, companyId: req.params._id })
    }
}

module.exports = {
    byId: idFetcher,
    byIds: idsFetcher,
    byEventAndCompany: byEventAndCompanyFetcher,
    allByEventAndCompany: allByEventAndCompanyFetcher
}