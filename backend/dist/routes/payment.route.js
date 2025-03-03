"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controller/payment.controller");
exports.router = express_1.default.Router();
exports.router.get('/', (req, res) => {
    res.send("Hii, there");
});
exports.router.post('/create-payment', payment_controller_1.createPayment);
exports.router.post('/verify-payment', payment_controller_1.verifyPayment);
