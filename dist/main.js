"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        allowedHeaders: [
            'Accept',
            'Authorization',
            'Content-Type',
            'X-Requested-With',
            'Origin',
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Methods'
        ],
        credentials: false,
        preflightContinue: false,
        optionsSuccessStatus: 200
    });
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, Origin');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        }
        else {
            next();
        }
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(3001, '0.0.0.0');
    console.log('🍷 Wine Shop Backend Started Successfully!');
    console.log('🔗 Local: http://localhost:3001');
    console.log('🌐 Network: http://43.204.130.122:3001');
    console.log('🔒 CORS: Enabled for all origins');
    console.log('⚡ Health Check: http://43.204.130.122:3001/health');
}
bootstrap();
//# sourceMappingURL=main.js.map