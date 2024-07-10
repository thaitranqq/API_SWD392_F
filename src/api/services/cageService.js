const _Cage = require('../models/Cage.model');
const _ServiceRecords = require('../models/ServiceRecords.model');

const getEmptyCage = async (data) => {
    try {
        const { bookingId } = data;
        const booking = await _ServiceRecords.findOne({ _id: bookingId });
        if (booking) {
            const startTime = booking.timeStartService;
            const endTime = booking.timeEndService;
            const bookings = await _ServiceRecords.find({
                $and: [
                    {
                        $or: [
                            { timeStartService: { $lt: endTime, $gt: startTime } },
                            { timeEndService: { $gt: startTime, $lt: endTime } },
                            { timeStartService: { $lte: startTime }, timeEndService: { $gte: endTime } },
                        ],
                    },
                    {
                        status: { $in: ['Processed', 'In Progress'] },
                    },
                ],
            });
            console.log('booking', bookings);

            if (bookings) {
                const bookedCages = bookings.map((booking) => booking.cage);

                const availableCages = await _Cage.find({
                    _id: { $nin: bookedCages },
                });
                return {
                    status: 'success',
                    message: 'Get empty cage successfully !',
                    data: availableCages,
                };
            }
            return {
                status: 'error',
                message: 'Get empty cage fail !',
                data: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: 'error',
            message: 'something was wrong in service',
            data: '',
        };
    }
};

module.exports = {
    getEmptyCage,
};
