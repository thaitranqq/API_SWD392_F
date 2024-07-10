import config from './config.json';
import mongoose from 'mongoose';
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';
const { uri, options } = config[env];

const connection = async (app) => {
    try {
        await mongoose
            .connect(uri, options)
            .then(() => console.log('Connected to MongoDB'))
            .catch((error) => console.error('Error connecting to MongoDB:', error));
        app.listen(PORT, () => {
            console.log('>>> JWT Backend is running on the port = ' + PORT);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export default connection;
