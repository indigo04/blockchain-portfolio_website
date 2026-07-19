"use server";

import { updateTag } from "next/cache";

export async function updateHistory() {
  updateTag("history");
}

export async function updateMarketplace() {
  updateTag("marketplace");
}
