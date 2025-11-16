import { getFirestore } from "firebase-admin/firestore";
import { app } from "@/firebase/server";

export interface FirestorePost {
    slug: string;
    title: string;
    description: string;
    pubDatetime: string;
    modDatetime: string;
    timezone: string;
    filePath: string;
}

export interface FirestorePostMapped {
    id: string;
    slug: string;
    filePath: string;
    collection: "blog";
    body?: string;
    data: {
      title: string;
      description: string;
      pubDatetime: Date;
      modDatetime: Date;
      timezone: string;
      tags: string[];
      author: string;
    };
}

  
  export function mapFirestoreToAstro(doc: any) {
    const data = doc.data();
    return {
      id: String(doc.id),
      slug: String(data.slug),
      filePath: String(data.filePath || ""),
      collection: "blog" as const,
      body: String(data.body || ""), // ✅ make sure body contains Markdown
      data: {
        title: String(data.title),
        description: String(data.description),
        pubDatetime: new Date(data.pubDatetime),
        modDatetime: new Date(data.modDatetime || data.pubDatetime),
        timezone: String(data.timezone || "UTC"),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        author: String(data.author || "Admin"),
      },
    };
  }
  
  

export async function getAllPosts() {
    const db = getFirestore(app);
    const snapshot = await db.collection("posts").get();
    return snapshot.docs.map(mapFirestoreToAstro);
}

export async function getPostBySlug(slug: string) {
    const db = getFirestore(app);
    const snapshot = await db.collection("posts").where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) return null;
    return mapFirestoreToAstro(snapshot.docs[0]);
  }