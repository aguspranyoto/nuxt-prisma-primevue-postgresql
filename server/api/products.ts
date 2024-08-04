import prisma from "../index";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) || 1;
  const size = parseInt(query.size as string) || 10;
  const sortField = (query.sortField as string) || "id";
  const sortOrder = parseInt(query.sortOrder as string) || 1;

  const skip = (page - 1) * size;
  const take = size;

  const total = await prisma.product.count();

  const orderBy = {
    [sortField]: sortOrder === 1 ? "asc" : "desc",
  };

  const products = await prisma.product.findMany({
    skip,
    take,
    orderBy,
  });

  return {
    data: products,
    total,
  };
});
