"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const logger_1 = require("./utils/logger");
async function bootstrap() {
    logger_1.logger.info(`====================== API Start - ${process.env.NODE_ENV} !!======================`);
    logger_1.logger.info(`====================== MYSQL_HOST Start - ${process.env.MYSQL_HOST} !!======================`);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    app.enableCors();
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map