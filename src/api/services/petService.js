import _Pet from '../models/Pet.model';
import _User from '../models/User.model';
import cloudinary from '../../config/cloudinary';

const createPet = async (req) => {
    try {
        const { path, filename } = req.file;
        const { userId, name, species, sex, breed, age, weight } = req.body;
        const image = {
            url: path,
            public_id: filename,
        };
        const pet = await _Pet.create({
            name,
            species,
            sex,
            breed,
            age,
            image,
            weight,
        });
        if (pet._id) {
            await _User.findByIdAndUpdate(userId, { $push: { pets: pet._id } });
            return {
                status: 'success',
                message: 'Pet created successfully !',
                data: pet,
            };
        }
        return {
            status: 'error',
            message: 'Pet created fail !',
            data: '',
        };
    } catch (error) {
        console.log(error);
        return {
            status: 'error',
            message: 'something was wrong in service',
            data: '',
        };
    }
};
const viewPet = async (data) => {
    try {
        const { userId } = data;
        const user = await _User.findOne({ _id: userId }).populate({
            path: 'pets',
        });

        if (user) {
            return {
                status: 'success',
                message: 'View pet success !',
                data: user.pets,
            };
        }

        return {
            status: 'error',
            message: 'View pet fail !',
            data: '',
        };
    } catch (error) {
        console.log(error);
        return {
            status: 'error',
            message: 'something was wrong in service',
            data: '',
        };
    }
};
const deletePet = async (data) => {
    try {
        const { userId, petId } = data;

        const user = await _User.findByIdAndUpdate(userId, { $pull: { pets: petId } }, { new: true });
        const pet = await _Pet.findByIdAndDelete(petId);

        if (user && pet) {
            await cloudinary.uploader.destroy(pet.image.public_id);
            return {
                status: 'success',
                message: 'Delete pet success !',
                data: '',
            };
        }

        return {
            status: 'error',
            message: 'Delete pet fail !',
            data: '',
        };
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
    createPet,
    viewPet,
    deletePet,
};
