import productService from '../services/productService';

const getProductsByCategory = async (req, res) => {
    try {
        let data = await productService.getProductsByCategory(req.query);
        return res.status(200).json({
            status: data.status,
            message: data.message,
            data: data.data,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'error from server',
            data: '',
        });
    }
};
const getProductsAndSortByPrice = async (req, res) => {
    try {
        let data = await productService.getProductsAndSortByPrice(req.query);
        return res.status(200).json({
            status: data.status,
            message: data.message,
            data: data.data,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'error from server',
            data: '',
        });
    }
};
const getProductsById = async (req, res) => {
    try {
        let data = await productService.getProductsById(req.params.id);
        return res.status(200).json({
            status: data.status,
            message: data.message,
            data: data.data,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'error from server',
            data: '',
        });
    }
};
const getProductsByName = async (req, res) => {
    try {
        let data = await productService.getProductsByName(req.query);
        return res.status(200).json({
            status: data.status,
            message: data.message,
            data: data.data,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'error from server',
            data: '',
        });
    }
};

module.exports = {
    getProductsByCategory,
    getProductsById,
    getProductsAndSortByPrice,
    getProductsByName,
};
