import _Order from '../models/Order.model';
import _Product from '../models/Product.model';
import _User from '../models/User.model';
import { getPriceByProductId } from './productService';
import nodemailer from 'nodemailer';

const updateQuatityProducts = async (cartDetails) => {
    for (let item of cartDetails) {
        let product = await _Product.findOneAndUpdate(
            { _id: item.productId },
            { $inc: { quantity: -item.quantity } },
            { new: true },
        );
        if (product.quantity <= 0) {
            await _Product.findByIdAndUpdate(product._id, { status: 'out of stock' });
        }
    }
};

const createOrder = async (data) => {
    try {
        const { userId, addressShipping, paymentMethod, cartDetails } = data;
        await updateQuatityProducts(cartDetails);
        const orderDetails = await Promise.all(
            cartDetails.map(async (cartDetail) => {
                let price = await getPriceByProductId(cartDetail.productId);
                return {
                    product: cartDetail.productId,
                    quantity: cartDetail.quantity,
                    price: price * cartDetail.quantity,
                };
            }),
        );
        const totalPrice = orderDetails.reduce((acc, orderDetail) => acc + orderDetail.price, 0) + 12000;
        let order = {};
        if (paymentMethod == 'OP') {
            order = await _Order.create({
                shipping: {
                    addressShipping: addressShipping,
                },
                payment: {
                    datePayment: Date.now(),
                    paymentMethod: paymentMethod,
                },
                orderDetails: orderDetails,
                totalPrice: totalPrice,
            });
        } else {
            order = await _Order.create({
                shipping: {
                    addressShipping: addressShipping,
                },
                payment: {
                    paymentMethod: paymentMethod,
                },
                orderDetails: orderDetails,
                totalPrice: totalPrice,
            });
        }
        if (order._id) {
            const userUpdate = await _User.findByIdAndUpdate(userId, { $push: { orders: order._id } });
            if (userUpdate) {
                return {
                    status: 'success',
                    message: 'Order created successfully !',
                    data: order,
                };
            }
        }
        return {
            status: 'error',
            message: 'Order created fail !',
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
const cancelOrder = async (data) => {
    try {
        const { orderId, reason } = data;
        const order = await _Order.findOne({ _id: orderId });
        if (order && order.status === 'Processing') {
            order.status = 'Cancelled';
            order.cancellation = {
                date: Date.now(),
                reason,
            };
            const newOrder = await order.save();
            if (newOrder) {
                return {
                    status: 'success',
                    message: 'Cancel order success !',
                    data: '',
                };
            }
        }

        return {
            status: 'error',
            message: 'Cancel order fail !',
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
const confirmOrder = async (data) => {
    try {
        const { orderId } = data;
        const order = await _Order.findOne({ _id: orderId });
        if (order && order.status === 'Processing') {
            const user = await _User.findOne({ orders: orderId });
            order.status = 'In Transit';
            const newOrder = await order.save();
            if (newOrder) {
                const listOrder = await _Order.findOne({ _id: newOrder._id }).populate({
                    path: 'orderDetails',
                    populate: {
                        path: 'product',
                    },
                });
                await sendOrderEmail(listOrder, user);
                return {
                    status: 'success',
                    message: 'Confirm order success please check mail to verify !',
                    data: '',
                };
            }
        }

        return {
            status: 'error',
            message: 'Confirm order fail !',
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
const getOrder = async (data) => {
    try {
        const { status } = data;
        const orders = await _Order.find({ status }).populate({
            path: 'orderDetails',
            populate: {
                path: 'product',
            },
        });
        if (orders) {
            return {
                status: 'success',
                message: 'get list order success !',
                data: orders,
            };
        }
        return {
            status: 'error',
            message: 'get list order fail !',
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
const getOrderHistory = async (data) => {
    try {
        const { userId } = data;
        const user = await _User.findOne({ _id: userId });
        const listOrders = user.orders;
        const orders = await _Order.find({ _id: { $in: listOrders } }).populate({
            path: 'orderDetails',
            populate: {
                path: 'product',
            },
        });
        if (orders) {
            return {
                status: 'success',
                message: 'get list order success !',
                data: orders,
            };
        }
        return {
            status: 'error',
            message: 'get list order fail !',
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

const sendOrderEmail = async (order, user) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'duykhoa21062003@gmail.com',
            pass: 'okzk ghpw niwd ltwb',
        },
    });

    const listProduct = order.orderDetails
        .map(
            (o) => `<table style="width: 100%; margin-top: 15px; border-bottom: 1px solid #e5e5e5;">
                    <tr style="border-bottom: 1px solid #e5e5e5;">
                        <td style="padding: 15px 0;">
                            <img
                                src=${o.product.image}
                                alt=""
                                style="
                                    width: 62px;
                                    height: 62px;
                                    margin-right: 15px;
                                    border: 1px solid #e5e5e5;
                                    border-radius: 8px;
                                    object-fit: contain;
                                    vertical-align: middle;
                                "
                            />
                            <span
                                style="
                                    font-size: 16px;
                                    font-weight: 600;
                                    line-height: 1.4;
                                    color: #555;
                                    vertical-align: middle;
                                "
                                >${o.product.name} x ${o.quantity}</span
                            >
                        </td>
                        <td style="font-size: 16px; font-weight: 600; line-height: 1.4; color: #555; text-align: right;">
                            ${o.price} ₫
                        </td>
                    </tr>
                </table>`,
        )
        .join('');

    await transporter.sendMail({
        from: '"PetHome Support" <duykhoa21062003@gmail.com>',
        to: user.email,
        subject: 'Xác nhận đơn hàng thành công',
        html: `<div style="width: 100%; background-color: #e5e5e5; padding: 20px 0; text-align: center;">
    <table style="width: 775px; background-color: white; margin: 0 auto; text-align: left;">
        <tr>
            <td style="text-align: center; border-bottom: 5px solid #e5e5e5; padding: 20px;">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzueDSm5pTF-duOUmKLMPQPQECmrEFcP2uSg&s"
                    alt=""
                    style="width: 88px; height: 88px; border-radius: 999px; border: 1px solid black"
                />
                <div style="font-size: 36px; font-weight: 700; color: #000000;">Pet Home</div>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; border-bottom: 5px solid #e5e5e5; padding: 20px;">
                <div style="font-size: 30px; font-weight: 600; margin-bottom: 20px; color: #000000;">Cảm ơn bạn đã đặt hàng</div>
                <div style="font-size: 16px; font-weight: 400; color: #000000;">
                    Xin chào ${
                        user.name
                    }, đơn đặt hàng của bạn đã sẵn sàng để vận chuyển. Chúng tôi sẽ cho bạn biết ngay khi
                    nó di chuyển đến vị trí của bạn
                </div>
                <a
                    href="#main"
                    style="
                        display: inline-block;
                        background-color: #eece7c;
                        padding: 8px;
                        text-decoration: none;
                        font-weight: 600;
                        color: black;
                        margin: 20px 0;
                    "
                    >Xem đơn đặt hàng</a>
            </td>
        </tr>
        <tr>
            <td id="main" style="padding: 60px; border-bottom: 5px solid #e5e5e5;">
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 25px; color: #000000;">Tóm tắt đơn hàng</div>
                ${listProduct}
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 25px; margin-top: 15px; color: #000000;">Chi phí thanh toán</div>
                <div style="text-align: right; font-size: 16px; font-weight: 600; line-height: 1.4; color: #555;">
                    <div>Giá: <span style="margin-left: 15px;">${order.totalPrice - 12000} ₫</span></div>
                    <div>Tiền ship: <span style="margin-left: 15px;">12000 ₫</span></div>
                    <div>Tổng: <span style="margin-left: 15px;">${order.totalPrice} ₫</span></div>
                </div>
            </td>
        </tr>
        <tr>
            <td class="footer" style="padding: 60px;">
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 25px; color: #000000;">Thông tin khách hàng</div>
                <table style="width: 100%;">
                    <tr>
                        <td style="vertical-align: top; padding-right: 20px;">
                            <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #000000;">Địa chỉ giao hàng</div>
                            <div style="font-size: 16px; font-weight: 600; line-height: 1.4; color: #555;width:300px">
                                ${order.shipping.addressShipping.street}, ${order.shipping.addressShipping.district}, ${
            order.shipping.addressShipping.city
        }
                            </div>
                        </td>
                        <td style="vertical-align: top;">
                            <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #000000;">Thông tin khách hàng</div>
                            <div style="font-size: 16px; font-weight: 600; line-height: 1.4; color: #555;">
                                Tên: ${user.name}
                            </div>
                            <div style="font-size: 16px; font-weight: 600; line-height: 1.4; color: #555;">
                                Email: ${user.email}
                            </div>
                            <div style="font-size: 16px; font-weight: 600; line-height: 1.4; color: #555;">
                                Sđt: ${user.phone}
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
`,
    });
};

module.exports = {
    createOrder,
    cancelOrder,
    confirmOrder,
    getOrder,
    getOrderHistory,
};
