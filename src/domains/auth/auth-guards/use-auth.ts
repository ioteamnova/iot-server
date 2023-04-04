import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiUnauthorizedErrorResponse } from 'src/core/swagger/api-unauthorized-response';
import { UserGuard } from './auth.gurad';

const UseAuthGuards = () => {
  return applyDecorators(
    UseGuards(UserGuard),
    ApiBearerAuth('accessToken'),
    ApiUnauthorizedErrorResponse(),
  );
};

export default UseAuthGuards;
