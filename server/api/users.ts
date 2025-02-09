import prisma from "../index";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) || 1;
  const size = parseInt(query.size as string) || 10;
  const sortField = (query.sortField as string) || "id";
  const sortOrder = parseInt(query.sortOrder as string) || 1;
  const searchTerm = (query.search as string) || ""; // Add this line to capture the search term

  const skip = (page - 1) * size;
  const take = size;

  // Build search filter
  const where = searchTerm
    ? {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      }
    : {};

  const total = await prisma.user.count({ where });

  const orderBy = {
    [sortField]: sortOrder === 1 ? "asc" : "desc",
  };

  const users = await prisma.user.findMany({
    skip,
    take,
    orderBy,
    where,
  });

  return {
    data: users,
    total,
  };
});
