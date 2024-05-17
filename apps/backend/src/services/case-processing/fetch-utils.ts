import axios from "axios";
import { Context, FetchPageResult } from "./context";

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchPage(url: string, ctx: Context, retries = 3): Promise<FetchPageResult | null> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(url);
            return { data: response.data, status: response.status };
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error(`Axios error fetching URL ${url} (attempt ${attempt}):`, error.message);
                if (attempt === retries) return null;
            } else if (error instanceof Error) {
                console.error(`Unknown error fetching URL ${url} (attempt ${attempt}):`, error.message);
                if (attempt === retries) return null;
            } else {
                console.error(`Unexpected error fetching URL ${url} (attempt ${attempt}):`, error);
                if (attempt === retries) return null;
            }
        }
        await sleep(ctx.requestDelay); // Delay between retries
    }
    return null;
}
