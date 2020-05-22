

// async function enqueueAll(req, res) {
//     const result = await get.enqueueAllStatus.from(req, res)

//     if(!result.success) {
//         return res.status(500).json({ message: `Failed to enqueue` })
//     }
//     result.data.map(queue => {
//         return {
//             position: queue.data.length - 1, companyId: queue.companyId
//         }
//     })
//     const positionInQueues = result.data
//     return res.status(200).json( { positions: positionInQueues })
// }

