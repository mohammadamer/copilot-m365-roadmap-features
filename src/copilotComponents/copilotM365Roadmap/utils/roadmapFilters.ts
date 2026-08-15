import type { IRoadmapItem } from '../models/IRoadmapItem';

/** Matches items whose numeric id or title contains the query (case-insensitive). */
export function searchRoadmapItems(items: IRoadmapItem[], query: string): IRoadmapItem[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return items;
  }

  const lowerQuery = trimmed.toLowerCase();
  return items.filter(
    (item) => String(item.id).includes(trimmed) || item.title.toLowerCase().includes(lowerQuery)
  );
}

/** Filters items to those matching any of the given statuses (no filter applied if empty). */
export function filterByStatus(items: IRoadmapItem[], statuses: string[]): IRoadmapItem[] {
  if (statuses.length === 0) {
    return items;
  }
  return items.filter((item) => statuses.indexOf(item.status) !== -1);
}

/** Filters items to those tagged with the given product (no filter applied if undefined). */
export function filterByProduct(items: IRoadmapItem[], product: string | undefined): IRoadmapItem[] {
  if (!product) {
    return items;
  }
  return items.filter((item) => item.products.indexOf(product) !== -1);
}

/** Returns the distinct, sorted set of product names present across all items. */
export function getDistinctProducts(items: IRoadmapItem[]): string[] {
  const productSet = new Set<string>();
  items.forEach((item) => item.products.forEach((product) => productSet.add(product)));
  return Array.from(productSet).sort((a, b) => a.localeCompare(b));
}

/** Returns the distinct, sorted set of statuses present across all items. */
export function getDistinctStatuses(items: IRoadmapItem[]): string[] {
  const statusSet = new Set<string>();
  items.forEach((item) => statusSet.add(item.status));
  return Array.from(statusSet).sort((a, b) => a.localeCompare(b));
}

/** Returns a single page of items for the given 1-based page number. */
export function paginate(items: IRoadmapItem[], page: number, pageSize: number): IRoadmapItem[] {
  const startIndex = (page - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
}

/** Total number of pages required to display all items at the given page size. */
export function getTotalPages(itemCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(itemCount / pageSize));
}
