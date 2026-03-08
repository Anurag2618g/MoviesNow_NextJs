import { connectDB } from "../db/mongo";
import { Content } from "./content.model";

export const getContentByIds = async (contentIds: string[]) => {
    await connectDB();

    const docs = await Content.find({contentId: { $in: contentIds }}).lean()
    const map = new Map();
    for (const doc of docs) {
        map.set(doc.contentId, doc);
    }

    return map;
};