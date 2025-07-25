import { db } from "$lib/server/db";
import { images } from "$lib/server/db/schema";
import type { Actions } from "@sveltejs/kit";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const load = async () => {
    const imgs = await db.select().from(images);
    return { imgs };
};

export const actions: Actions = {
    uploadImage: async ({ request }) => {
        const formData = await request.formData();
        const file = formData.get("image");
        if (!file || typeof file === "string") {
            return { error: "Invalid file" };
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const filename = `${randomUUID()}.${ext}`;
        const filepath = path.resolve("static/uploads", filename);
        await fs.mkdir(path.dirname(filepath), { recursive: true });
        await fs.writeFile(filepath, buffer);

        // Use API route instead of direct static file path
        const fileUrl = `/api/uploads/${filename}`;

        await db.insert(images).values({
            url: fileUrl,
        });
        return { success: true };
    },
};
