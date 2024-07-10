import _Pet from '../models/Pet.model';
import _User from '../models/User.model';
const _WorkSchedule = require('../models/WorkSchedule.model');

const createSchedule = async (req) => {
    try {
        const { userId, petId, startDate, endDate} = req.body;
        const schedule = await _WorkSchedule.create({
            startDate,
            endDate,
        });
        
        if (schedule._id) {
            await _User.findByIdAndUpdate(userId, { $push: { schedule: schedule._id } });
            return {
                status: 'success',
                message: 'Order created successfully !',
                data: order,
            };
            
        }
        return {
            status: 'error',
            message: 'Schedule created fail !',
            data: '',
        };
    } catch (error) {
        console.log(error);
        return {
            status: 'error',
            message: 'something was wrong',
            data: '',
        };
    }
};