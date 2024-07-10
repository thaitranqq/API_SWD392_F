import _User from '../models/User.model';
import _Otp from '../models/Otp.model';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { createAccessToken, createRefreshToken } from '../services/jwtService';

const isEmailExist = async (email) => {
    const user = await _User.findOne({ email });
    if (user) {
        return true;
    } else {
        return false;
    }
};
const isPhoneExist = async (phone) => {
    const user = await _User.findOne({ phone });
    if (user) {
        return true;
    } else {
        return false;
    }
};
const sendOtp = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'duykhoa21062003@gmail.com',
            // pass: 'hksz zqbq jzud sheh',
            pass: 'okzk ghpw niwd ltwb',
        },
    });

    await transporter.sendMail({
        from: '"PetHome Support" <duykhoa21062003@gmail.com>',
        to: email,
        subject: 'Xác minh OTP để đăng ký tài khoản',
        html: `
        <div style="width:100%">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="775" style="background-color: #212429; padding: 80px; box-sizing: border-box;">
                            <tr>
                                <td style="padding-bottom: 45px;">
                                    <img
                                        style="width: 88px; height: 88px; border-radius: 999px;"
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzueDSm5pTF-duOUmKLMPQPQECmrEFcP2uSg&s"
                                        alt=""
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td align="left" style="font-size: 36px; line-height: 42px; font-family: Arial, sans-serif, 'Motiva Sans'; color: #bfbfbf; font-weight: bold;">
                                    Xin chào,
                                </td>
                            </tr>
                            <tr>
                                <td align="left" style="font-size: 28px; line-height: 36px; font-family: Arial, sans-serif, 'Motiva Sans'; color: #ffffff; font-weight: bold; padding-top: 30px;padding-bottom: 30px">
                                    Đây là mã xác nhận mà bạn cần để đăng ký tài khoản của mình:
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="background-color: #17191c; padding: 30px 56px; box-sizing: border-box; font-size: 48px; line-height: 52px; font-family: Arial, sans-serif, 'Motiva Sans'; color: #3a9aed; font-weight: bold; text-align: center">
                                    ${otp}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
        `, // html body
    });
};
const createUser = async (user) => {
    try {
        const checkEmail = await isEmailExist(user.email);
        if (checkEmail) {
            return {
                status: 'error',
                message: 'email is already exist',
                data: '',
            };
        }
        const checkPhone = await isPhoneExist(user.phone);
        if (checkPhone) {
            return {
                status: 'error',
                message: 'phone is already exist',
                data: '',
            };
        }
        const otp = await otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        const salt = await bcrypt.genSalt(10);
        const hashOtp = await bcrypt.hash(otp, salt);
        await _Otp.create({
            email: user.email,
            otp: hashOtp,
        });

        await sendOtp(user.email, otp);
        return { status: 'success', message: 'Please check mail to get otp', data: '' };
    } catch (error) {
        return {
            status: 'error',
            message: 'something was wrong in service',
            data: '',
        };
    }
};
const verifyOtp = async (data) => {
    try {
        const listOtp = await _Otp.find({ email: data.email });
        if (listOtp.length > 0) {
            const lastOtp = listOtp[listOtp.length - 1].otp;
            const verify = await bcrypt.compare(data.otp, lastOtp);
            if (verify) {
                const salt = await bcrypt.genSalt(10);
                const hashPass = await bcrypt.hash(data.password, salt);
                await _User.create({
                    name: data.name,
                    email: data.email,
                    password: hashPass,
                    phone: data.phone,
                    dob: data.dob,
                    sex: data.sex,
                });
                return {
                    status: 'success',
                    message: 'Register success !',
                    data: '',
                };
            }
        }
        return {
            status: 'error',
            message: 'otp is wrong',
            data: '',
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'something was wrong in service',
            data: '',
        };
    }
};

const checkUserExist = async (email) => {
    try {
        const user = await _User.findOne({ email });
        return user;
    } catch (error) {
        console.log(error);
        return;
    }
};

const loginUser = async (data) => {
    try {
        const user = await checkUserExist(data.email);

        if (user) {
            const payload = {
                email: user.email,
                role: user.role,
            };

            const accessToken = createAccessToken(payload);
            const refreshToken = createRefreshToken(payload);
            const checkPassword = await bcrypt.compare(data.password, user.password);
            if (checkPassword) {
                return {
                    status: 'success',
                    message: 'Login success !',
                    data: {
                        email: user.email,
                        name: user.name,
                        id: user._id,
                        role: user.role,
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    },
                };
            }
        }
        return {
            status: 'error',
            message: 'email or password was wrong',
            data: '',
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'something was wrong in service',
            data: '',
        };
    }
};

module.exports = {
    createUser,
    verifyOtp,
    loginUser,
};
