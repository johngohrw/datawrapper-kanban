"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var utils_1 = require("./utils");
var prisma = new client_1.PrismaClient({
    errorFormat: "minimal"
});
var app = (0, express_1.default)();
var APP_PORT_NUMBER = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// sign up
app.post("/signup", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, columns, columnsData, userCount, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, columns = _a.columns;
                columnsData = columns === null || columns === void 0 ? void 0 : columns.map(function (col) {
                    return { title: col === null || col === void 0 ? void 0 : col.title, tasks: [] };
                });
                return [4 /*yield*/, prisma.user.count({
                        where: { email: email }
                    })];
            case 1:
                userCount = _b.sent();
                if (!(userCount > 0)) return [3 /*break*/, 2];
                res.json({ error: "The email ".concat(email, " is already registered, please sign in instead.") });
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, prisma.user.create({
                    data: {
                        name: name,
                        email: email,
                        columns: {
                            create: columnsData,
                        },
                    },
                })];
            case 3:
                result = _b.sent();
                res.json(result);
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
// log in
app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { email: email },
                    })];
            case 1:
                user = _a.sent();
                res.json(user || { error: "The email ".concat(email, " does not exist in our records") });
                return [2 /*return*/];
        }
    });
}); });
// get all users
app.get('/users', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findMany()];
            case 1:
                users = _a.sent();
                res.json(users);
                return [2 /*return*/];
        }
    });
}); });
// get all tasks
app.get('/tasks', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tasks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.task.findMany()];
            case 1:
                tasks = _a.sent();
                res.json(tasks);
                return [2 /*return*/];
        }
    });
}); });
// get all columns
app.get('/columns', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var columns;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.column.findMany()];
            case 1:
                columns = _a.sent();
                res.json(columns);
                return [2 /*return*/];
        }
    });
}); });
// get all columns for a particular user
app.get('/columns/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, columns;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                return [4 /*yield*/, prisma.column.findMany({
                        where: { userId: parseInt(userId) },
                    })];
            case 1:
                columns = _a.sent();
                res.json(columns);
                return [2 /*return*/];
        }
    });
}); });
// get all tasks and columns for a particular user
app.get('/board/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, columns, tasks, board;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                return [4 /*yield*/, prisma.column.findMany({
                        where: { userId: parseInt(userId) },
                    })];
            case 1:
                columns = _a.sent();
                return [4 /*yield*/, prisma.task.findMany({
                        where: {
                            columnId: {
                                in: columns.map(function (column) { return column.id; })
                            }
                        },
                    })];
            case 2:
                tasks = _a.sent();
                board = columns.reduce(function (acc, column) {
                    var id = column.id;
                    acc.set(id, __assign(__assign({}, column), { tasks: [] }));
                    return acc;
                }, new Map());
                tasks.forEach(function (task) {
                    var column = board.get(task.columnId);
                    column.tasks.push(task);
                    board.set(task.columnId, column);
                });
                res.json({ board: Object.fromEntries(board) });
                return [2 /*return*/];
        }
    });
}); });
// create new column for a user
app.post("/column", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, userId, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, userId = _a.userId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.column.create({
                        data: {
                            title: title,
                            user: { connect: { id: userId } },
                        },
                    })];
            case 2:
                result = _b.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.json({ error: "user with ID ".concat(userId, " does not exist in the database.") });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// create new task for a particular column
app.post("/task", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, columnId, result, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, description = _a.description, columnId = _a.columnId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.task.create({
                        data: {
                            title: title,
                            description: description,
                            column: { connect: { id: columnId } },
                        },
                    })];
            case 2:
                result = _b.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                res.json({ error: (0, utils_1.getGeneralizedPrismaErrorMessage)(error_2) });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// update a column
app.put("/column/:columnId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var columnId, title, column, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                columnId = req.params.columnId;
                title = req.body.title;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.column.update({
                        where: { id: parseInt(columnId) },
                        data: {
                            title: title
                        }
                    })];
            case 2:
                column = _a.sent();
                res.json(column);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.json({ error: "column with ID ".concat(columnId, " does not exist in the database.") });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// update a task
app.put("/task/:taskId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskId, task, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                taskId = req.params.taskId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.task.update({
                        where: { id: parseInt(taskId) },
                        data: req.body
                    })];
            case 2:
                task = _a.sent();
                res.json(task);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.json({ error: "task with ID ".concat(taskId, " does not exist in the database.") });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// delete a task
app.delete("/task/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, task, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.task.delete({
                        where: {
                            id: Number(id),
                        },
                    })];
            case 2:
                task = _a.sent();
                res.json(task);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.json({ error: "task with ID ".concat(id, " does not exist in the database.") });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// delete a column
app.delete("/column/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, column, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.column.delete({
                        where: {
                            id: Number(id),
                        },
                    })];
            case 2:
                column = _a.sent();
                res.json(column);
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                res.json({ error: "column with ID ".concat(id, " does not exist in the database.") });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
var server = app.listen(APP_PORT_NUMBER, function () {
    return console.log("Server up at: http://localhost:".concat(APP_PORT_NUMBER));
});
//# sourceMappingURL=index.js.map