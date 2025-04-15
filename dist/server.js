"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoute_js_1 = __importDefault(require("./Routes/userRoute.js"));
const db_js_1 = __importDefault(require("./Config/db.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Routes
app.get('/', (_req, res) => {
    res.send('API is working with TypeScript!');
});
app.use('/api/users', userRoute_js_1.default);
// Sequelize Sync and Server Start
db_js_1.default.sync({ alter: true }) // alter updates schema to match models
    .then(() => {
    console.log('✅ Database connected and synchronized.');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
    .catch((error) => {
    console.error('❌ Database sync error:', error);
});
