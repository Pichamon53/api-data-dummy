"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var http_1 = require("http");
var FetchError = /** @class */ (function (_super) {
    __extends(FetchError, _super);
    function FetchError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'FetchError';
        return _this;
    }
    return FetchError;
}(Error));
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get('https://dummyjson.com/users')];
                case 1:
                    response = _a.sent();
                    if (response.data && Array.isArray(response.data.users)) {
                        return [2 /*return*/, response.data.users];
                    }
                    else {
                        throw new FetchError('Invalid data structure received from API');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    if (error_1 instanceof FetchError) {
                        console.error('Failed to fetch users:', error_1.message);
                    }
                    else if (error_1 instanceof Error) {
                        console.error('Failed to fetch users:', error_1.message);
                    }
                    else {
                        console.error('Failed to fetch users and the error did not have a message property.');
                    }
                    throw error_1; // Re-throw the error to be handled by the caller
                case 3: return [2 /*return*/];
            }
        });
    });
}
function transformUsersData(users) {
    var departmentData = {};
    users.forEach(function (user) {
        var department = user.department, gender = user.gender, age = user.age, hair = user.hair, firstName = user.firstName, lastName = user.lastName, address = user.address;
        // Normalize hair color with a fallback
        var normalizedHairColor = [
            "Black",
            "Blond",
            "Chestnut",
            "Brown",
        ].includes(hair.color)
            ? hair.color
            : "Other";
        if (!departmentData[department]) {
            departmentData[department] = {
                male: 0,
                female: 0,
                ageRange: "".concat(age, "-").concat(age),
                hair: {
                    Black: 0,
                    Blond: 0,
                    Chestnut: 0,
                    Brown: 0,
                    Other: 0,
                },
                addressUser: {},
            };
        }
        var dept = departmentData[department];
        if (gender.toLowerCase() === 'male') {
            dept.male += 1;
        }
        else if (gender.toLowerCase() === 'female') {
            dept.female += 1;
        }
        var _a = dept.ageRange.split('-').map(Number), minAge = _a[0], maxAge = _a[1];
        dept.ageRange = "".concat(Math.min(minAge, age), "-").concat(Math.max(maxAge, age));
        dept.hair[normalizedHairColor] += 1;
        dept.addressUser["".concat(firstName).concat(lastName)] = address.postalCode;
    });
    return departmentData;
}
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var server;
        var _this = this;
        return __generator(this, function (_a) {
            server = (0, http_1.createServer)(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var users, usersByDepartment, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.url === '/users')) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fetchUsers()];
                        case 2:
                            users = _a.sent();
                            usersByDepartment = transformUsersData(users);
                            res.setHeader('Content-Type', 'application/json');
                            res.statusCode = 200;
                            res.end(JSON.stringify(usersByDepartment));
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            res.statusCode = 500;
                            res.end('Error fetching users');
                            return [3 /*break*/, 4];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.statusCode = 404;
                            res.end('Not found');
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            server.listen(3000, function () {
                console.log('Server running on http://localhost:3000');
            });
            return [2 /*return*/];
        });
    });
}
startServer();
