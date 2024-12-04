import { SetMetadata } from '@nestjs/common';

// Декоратор для неавторизированного доступа к API
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
