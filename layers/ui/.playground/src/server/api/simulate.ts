const isSuccess = (success_rate: number): boolean => {
  return Math.random() < success_rate;
};

const sleep = async (delay: number): Promise<void> =>
  await new Promise((r) => setTimeout(r, delay));

export default defineEventHandler(async (event) => {
  const { success_rate, delay, response: queryResponse } = getQuery(event);
  const { response: bodyResponse } = await readBody(event).catch(() => ({}));

  if (delay && typeof Number(delay) === "number") {
    await sleep(Number(delay));
  }

  if (
    !success_rate ||
    (typeof Number(success_rate) === "number" &&
      isSuccess(Number(success_rate)))
  ) {
    return queryResponse ?? bodyResponse;
  }

  throw createError({
    statusCode: 500,
  });
});
