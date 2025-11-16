import type { APIRoute } from "astro";
import { getFirestore } from "firebase-admin/firestore";
import { app } from "@/firebase/server";

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) return new Response("Missing slug", { status: 400 });

  const db = getFirestore(app);

  try {
    const doc = await db.collection("posts").doc(slug).get();
    if (!doc.exists) return new Response("Post not found", { status: 404 });

    const data = doc.data();
    if (!data) return new Response("Post data not found", { status: 404 });

    // Only the fields your front expects
    const post = {
      id: slug,
      slug: data.slug,
      filePath: data.filePath,
      data: {
        title: data.title,
        description: data.description,
        pubDatetime: data.pubDatetime,
        modDatetime: data.modDatetime,
        timezone: data.timezone,
      },
    };

    return new Response(JSON.stringify(post), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
};