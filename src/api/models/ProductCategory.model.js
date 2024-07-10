const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    species: {
        type: String,
        enum: ['dog', 'cat', 'both'],
    },
});

const _ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
module.exports = _ProductCategory;
