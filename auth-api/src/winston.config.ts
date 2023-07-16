import { ConfigService } from '@nestjs/config';
import winston, { format, transports } from 'winston';
import ecsFormat from '@elastic/ecs-winston-format';
import { utilities } from 'nest-winston';

export default (cs: ConfigService) => {
  const transportList: winston.transport[] = [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.ms(),
        utilities.format.nestLike(process.env.npm_package_name, {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
  ];

  if (cs.get('NODE_ENV') === 'production') {
    transportList.push(
      new transports.File({
        format: ecsFormat(),
        filename: `/api/log/${process.env.npm_package_name}.log`,
      }),
    );
  }

  return {
    transports: transportList,
  };
};
