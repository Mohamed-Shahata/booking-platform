"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
/**
 * Calculates pagination values (limit and skip) from query params.
 * @param {string} [page] - Current page number.
 * @param {string} [limit] - Items per page.
 * @returns {{ limitNumber: number, skip: number }} Pagination data.
 */
const getPagination = (page, limit) => {
    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 20;
    const skip = (pageNumber - 1) * limitNumber;
    return { limitNumber, skip };
};
exports.getPagination = getPagination;
