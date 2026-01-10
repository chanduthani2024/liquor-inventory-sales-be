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
            'http://127.0.0.1:3000',
            'http://43.204.130.122:3000',
            'http://43.204.130.122:5000',
            'http://43.204.130.122',
            '*'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
            'Origin',
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Methods'
        ],
        credentials: true,
        optionsSuccessStatus: 200,
        preflightContinue: false,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(3001, '0.0.0.0');
    console.log('Wine Shop Backend is running on http://0.0.0.0:3001');
    console.log('Network access: http://43.204.130.122:3001');
}
bootstrap();
//# sourceMappingURL=main.js.map