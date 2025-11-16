"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://172.22.31.39:3000',
            /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:3000$/,
            /^http:\/\/172\.\d{1,3}\.\d{1,3}\.\d{1,3}:3000$/,
            /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:3000$/,
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(3001, '0.0.0.0');
    console.log('Wine Shop Backend is running on http://0.0.0.0:3001');
    console.log('Network access: http://172.22.31.39:3001');
}
bootstrap();
//# sourceMappingURL=main.js.map