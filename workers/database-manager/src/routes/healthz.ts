export default defineEventHandler(async (event) => {
  let result:
    | {
        uptime?: number;
        responseTime?: [number, number];
        message: string;
        timestamp?: number;
      }
    | undefined;

  try {
    result = {
      uptime: process.uptime(),
      responseTime: process.hrtime(),
      message: `OK`,
      timestamp: Date.now(),
    };
    setResponseStatus(event, 200);
  } catch (error: unknown) {
    if (!result)
      result = {
        message: (error as Error)?.message,
      };
    result.message = (error as Error)?.message;
    setResponseStatus(event, 503);
  }

  return result;
});
