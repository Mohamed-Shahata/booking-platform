/**
 * Calculates pagination values (limit and skip) from query params.
 * @param {string} [page] - Current page number.
 * @param {string} [limit] - Items per page.
 * @returns {{ limitNumber: number, skip: number }} Pagination data.
 */
export const getPagination = (
  page?: string,
  limit?: string
): { limitNumber: number; skip: number } => {
  const pageNumber = page ? parseInt(page) : 1;
  const limitNumber = limit ? parseInt(limit) : 20;
  const skip = (pageNumber - 1) * limitNumber;

  return { limitNumber, skip };
};
