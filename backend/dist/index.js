"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const user_route_1 = require("./routes/user.route");
const admin_route_1 = require("./routes/admin.route");
const campaign_route_1 = require("./routes/campaign.route");
const path_1 = __importDefault(require("path"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use('/api/v1/user', user_route_1.router);
app.use('/api/v1/admin', admin_route_1.router);
app.use('/api/v1/campaign', campaign_route_1.router);
app.listen(process.env.PORT || 5000, () => {
    console.log(`App is running on port ${process.env.PORT}`);
});
