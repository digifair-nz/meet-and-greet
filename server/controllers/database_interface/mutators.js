const enqueueMutator = {
    mutate: async function mutate(ofCollection, req) {
        try {
            if(ofCollection.data.includes(req.payload._id)) {
                return { success: false, error: `User already in queue` }
            }
            if(ofCollection.blacklist.includes(req.payload._id)) {
                return { success: false, error: `User already had session` }
            }
            ofCollection.data.push(req.payload._id)
            return { success: true, error: null }
        }
        catch (error) {
            return { success: false, error }
        }
    }
}

const dequeueMutator = {
    mutate: async function mutate(ofCollection, req) {
        try {
            const index = ofCollection.data.indexOf(req.payload._id)
            if(index == -1) {
                return { success: false, error: `User was not queued` }
            }
            ofCollection.data.splice(index, 1)
            return { success: true, error: null }
        }
        catch (error) {
            return { success: false, error }
        }
    }
}

module.exports = {
    enqueue: enqueueMutator,
    dequeue: dequeueMutator
}