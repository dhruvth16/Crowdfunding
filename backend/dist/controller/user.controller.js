"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogout = exports.userSignin = exports.userSignup = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.z.object({
        email: zod_1.z.string().min(3).max(100).email(),
        password: zod_1.z
            .string()
            .min(8)
            .max(100)
            .refine((password) => /[A-Z]/.test(password), {
            message: "uppercaseErrorMessage",
        })
            .refine((password) => /[a-z]/.test(password), {
            message: "lowercaseErrorMessage",
        })
            .refine((password) => /[0-9]/.test(password), {
            message: "numberErrorMessage",
        })
            .refine((password) => /[!@#$%^&*]/.test(password), {
            message: "specialCharacterErrorMessage",
        }),
        firstname: zod_1.z.string().min(3).max(100),
        lastname: zod_1.z.string().min(3).max(100),
        address: zod_1.z.string().min(3).max(200),
        phone_num: zod_1.z.string().max(12)
    });
    const safeParsedData = requiredBody.safeParse(req.body);
    if (!safeParsedData.success) {
        res.status(401).json({
            message: "Incorrect credentials!",
            error: safeParsedData.error,
        });
        return;
    }
    const { email, password, firstname, lastname, address, phone_num } = req.body;
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    try {
        const existingUser = yield exports.prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (existingUser) {
            res.status(409).json({
                message: "User already exists!"
            });
            return;
        }
        const user = yield exports.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstname,
                lastname,
                address,
                phone_num
            }
        });
        res.status(201).json({
            user
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        });
        console.log(error);
    }
});
exports.userSignup = userSignup;
const userSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.z.object({
        email: zod_1.z.string().min(3).max(100).email(),
        password: zod_1.z
            .string()
            .min(8)
            .max(100)
            .refine((password) => /[A-Z]/.test(password), {
            message: "uppercaseErrorMessage",
        })
            .refine((password) => /[a-z]/.test(password), {
            message: "lowercaseErrorMessage",
        })
            .refine((password) => /[0-9]/.test(password), {
            message: "numberErrorMessage",
        })
            .refine((password) => /[!@#$%^&*]/.test(password), {
            message: "specialCharacterErrorMessage",
        }),
    });
    const safeParsedData = requiredBody.safeParse(req.body);
    if (!safeParsedData.success) {
        res.status(401).json({
            message: "Incorrect credentials!",
            error: safeParsedData.error,
        });
        return;
    }
    const { email, password } = req.body;
    try {
        const existingUser = yield exports.prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!existingUser) {
            res.status(404).json({
                message: "User not found!"
            });
            return;
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            res.status(401).json({
                message: "Incorrect password!",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: existingUser.id
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });
        res.status(200).json({
            message: "User signed in successfully!",
            token
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        });
    }
});
exports.userSignin = userSignin;
function createToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 30);
        const newToken = yield exports.prisma.expireToken.create({
            data: {
                token: token,
                expireAt: expirationTime,
            },
        });
        console.log(newToken);
    });
}
function logout(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingToken = yield exports.prisma.expireToken.findFirst({
                where: {
                    token: token,
                },
            });
            if (!existingToken) {
                throw new Error('Token not found or already invalid');
            }
            const updatedToken = yield exports.prisma.expireToken.update({
                where: {
                    id: existingToken.id,
                },
                data: {
                    expireAt: new Date(),
                },
            });
            console.log('Token invalidated successfully:', updatedToken);
            return { success: true, message: 'Logged out successfully' };
        }
        catch (error) {
            console.error('Logout error:', error.message);
            throw new Error('Logout failed: ' + error.message);
        }
    });
}
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(400).json({ error: 'No token provided' });
        return;
    }
    try {
        yield createToken(token);
        const result = yield logout(token);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.userLogout = userLogout;
