import _ServiceRecords from '../models/ServiceRecords.model';
import _Pet from '../models/Pet.model';
import _User from '../models/User.model';
import _Product from '../models/Product.model';
import nodemailer from 'nodemailer';

const createServiceRecord = async (data) => {
    try {
        const { petId, timeStartService, productId } = data;
        const pet = await _Pet.findOne({ _id: petId });
        if (pet.serviceStatus == 'active') {
            return {
                status: 'error',
                message: 'Pet is being registered for the service',
                data: '',
            };
        }
        const startTime = new Date(timeStartService);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        const service = await _Product.findOne({ _id: productId });
        const price = service.price;
        const serviceRecord = await _ServiceRecords.create({
            timeStartService: startTime,
            timeEndService: endTime,
            price,
            product: productId,
        });
        if (serviceRecord) {
            const petUpdate = await _Pet.findByIdAndUpdate(petId, { $push: { serviceRecords: serviceRecord._id } });
            if (petUpdate) {
                petUpdate.serviceStatus = 'active';
                await petUpdate.save();
                return {
                    status: 'success',
                    message: 'Booking service successfully !',
                    data: serviceRecord,
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

const cancelServiceRecord = async (data) => {
    try {
        const { serviceRecordId, reason } = data;
        const serviceRecord = await _ServiceRecords.findOne({ _id: serviceRecordId });
        if (serviceRecord && serviceRecord.status === 'Processing') {
            serviceRecord.status = 'Cancelled';
            serviceRecord.cancellation = {
                date: Date.now(),
                reason,
            };
            const newserviceRecord = await serviceRecord.save();
            if (newserviceRecord) {
                return {
                    status: 'success',
                    message: 'Cancel service success !',
                    data: '',
                };
            }
        }

        return {
            status: 'error',
            message: 'Cancel service fail !',
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
const confirmServiceRecord = async (data) => {
    try {
        const { bookingId, cageId } = data;
        const booking = await _ServiceRecords.findOne({ _id: bookingId });
        if (booking && booking.status === 'Processing') {
            const pet = await _Pet.findOne({ serviceRecords: bookingId });
            if (pet) {
                const user = await _User.findOne({ pets: pet._id });
                booking.status = 'Processed';
                booking.cage = cageId;
                const newBooking = await booking.save();

                if (newBooking) {
                    const listBooking = await _ServiceRecords.findOne({ _id: newBooking._id }).populate('product');
                    await sendBookingEmail(listBooking, user, pet);
                    return {
                        status: 'success',
                        message: 'Confirm booking success please check mail to verify !',
                        data: '',
                    };
                }
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

const sendBookingEmail = async (booking, user, pet) => {
    const dateTimeString = booking.timeStartService.toISOString();
    const [date, timeWithMs] = dateTimeString.split('T');
    const time = timeWithMs.split('.')[0];
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'duykhoa21062003@gmail.com',
            pass: 'okzk ghpw niwd ltwb',
        },
    });

    const listProduct = `<table style="width: 100%; margin-top: 15px; border-bottom: 1px solid #e5e5e5;">
                    <tr style="border-bottom: 1px solid #e5e5e5;">
                        <td style="padding: 15px 0;">
                            <img
                                src=${booking.product.image}
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
                                >${booking.product.name}</span
                            >
                        </td>
                        <td style="font-size: 16px; font-weight: 600; line-height: 1.4; color: #555; text-align: right;">
                            ${booking.product.price} ₫
                        </td>
                    </tr>
                </table>`;

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
                <div style="font-size: 30px; font-weight: 600; margin-bottom: 20px; color: #000000;">Cảm ơn bạn đã đăng kí dịch vụ spa cho thú cưng</div>
                <div style="font-size: 16px; font-weight: 400; color: #000000;">
                    Xin chào ${user.name}, Đơn đăng ký dịch vụ spa thú cưng của bạn đã được xác nhận. Chúng tôi rất vui mừng thông báo rằng lịch hẹn của bạn đã được sắp xếp và sẵn sàng để sử dụng vào ${date} lúc ${time}, thời gian dự kiến hoàn thành dịch vụ là 1 tiếng. Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!
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
                    <div>Tổng: <span style="margin-left: 15px;">${booking.product.price} ₫</span></div>
                </div>
            </td>
        </tr>
        <tr>
            <td class="footer" style="padding: 60px;">
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 25px; color: #000000;">Thông tin khách hàng</div>
                <table style="width: 100%;">
                    <tr>
                        <td style="vertical-align: top; padding-right: 200px;">
                            <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #000000;">Thông tin thú cưng</div>
                            <div style="font-size: 16px; font-weight: 600; line-height: 1.4; color: #555;">
                                Tên: ${pet.name}
                            </div>
                            <div style="font-size: 16px; font-weight: 600; line-height: 1.4; color: #555;">
                                Loài: ${pet.species}
                            </div>
                            <div style="font-size: 16px; font-weight: 600; line-height: 1.4; color: #555;">
                                Tuổi: ${pet.age}
                            </div>
                            <div style="font-size: 16px; font-weight: 600; line-height: 1.4; color: #555;">
                                Cân nặng: ${pet.weight}kg
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
    createServiceRecord,
    cancelServiceRecord,
    confirmServiceRecord,
};
