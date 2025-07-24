import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    return handleReviewRequest(req, "POST");
}

export async function PUT(req: NextRequest) {
    return handleReviewRequest(req, "PUT");
}

export async function DELETE(req: NextRequest) {
    return handleReviewRequest(req, "DELETE");
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("id");
    const userId = searchParams.get("userId");
    const itemId = searchParams.get("itemId");

    if (reviewId) {
        try {
            const cookieStore = cookies();
            const supabase = createClient(cookieStore);

            const { data: review, error } = await supabase
                .from("reviews")
                .select("*")
                .eq("id", reviewId)
                .single();

            if (error) throw error;
            return NextResponse.json(review);
        } catch (error) {
            console.error("GET review error:", error);
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }
    }

    if (userId && itemId) {
        try {
            const cookieStore = cookies();
            const supabase = createClient(cookieStore);

            const { data: review, error } = await supabase
                .from("reviews")
                .select("*")
                .match({ user_id: userId, item_id: itemId })
                .single();

            return NextResponse.json(review ? review : null);
        } catch (error) {
            console.error("GET review error:", error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    }

    return NextResponse.json(
        { error: "Missing parameters. Provide either review id or user+item ids" },
        { status: 400 }
    );
}

async function handleReviewRequest(
    req: NextRequest,
    method: "POST" | "PUT" | "DELETE"
) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const body = await req.json();
    let authUser;

    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);
        if (error) console.error("Token validation error:", error);
        else authUser = user;
    }

    if (!authUser && body?.userId) {
        authUser = { id: body.userId };
    }

    if (!authUser) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    try {
        if (method === "POST") return createReview(body, supabase, authUser.id);
        if (method === "PUT") return updateReview(body, supabase, authUser.id);
        if (method === "DELETE") return deleteReview(body, supabase, authUser.id);
    } catch (error) {
        console.error("Review API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

async function createReview(body: any, supabase: any, userId: string) {
    const { itemId, itemType, rating, text, isPublic } = body;

    if (!itemId || !itemType || !rating) {
        return NextResponse.json(
            { error: "Missing required fields: itemId, itemType, rating" },
            { status: 400 }
        );
    }
    if (!["track", "album"].includes(itemType)) {
        return NextResponse.json(
            { error: "Invalid itemType. Only track or album allowed" },
            { status: 400 }
        );
    }
    if (rating < 1 || rating > 5) {
        return NextResponse.json(
            { error: "Rating must be between 1 and 5" },
            { status: 400 }
        );
    }

    const { error: upsertError } = await supabase
        .from("spotify_items")
        .upsert({ id: itemId, type: itemType }, { onConflict: "id" });
    if (upsertError) throw upsertError;

    const { data: review, error: reviewError } = await supabase
        .from("reviews")
        .insert({
            user_id: userId,
            item_id: itemId,
            rating,
            text: text || null,
            is_public: isPublic !== false,
        })
        .select()
        .single();
    if (reviewError) {
        if (reviewError.code === "23505") {
            return NextResponse.json(
                { error: "You have already reviewed this item" },
                { status: 400 }
            );
        }
        throw reviewError;
    }

    // RPC to increment review count
    await supabase.rpc("increment_review_count", { item_id: itemId });

    return NextResponse.json(review, { status: 201 });
}

async function updateReview(body: any, supabase: any, userId: string) {
    const { reviewId, rating, text, isPublic } = body;
    if (!reviewId) {
        return NextResponse.json(
            { error: "Review ID is required" },
            { status: 400 }
        );
    }

    const { data: existingReview, error: fetchError } = await supabase
        .from("reviews")
        .select("*")
        .eq("id", reviewId)
        .single();
    if (fetchError) throw fetchError;
    if (existingReview.user_id !== userId) {
        return NextResponse.json(
            { error: "Unauthorized to update this review" },
            { status: 403 }
        );
    }

    const updateData: any = {};
    if (rating !== undefined) {
        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }
        updateData.rating = rating;
    }
    if (text !== undefined) updateData.text = text;
    if (isPublic !== undefined) updateData.is_public = isPublic;

    const { data: updatedReview, error: updateError } = await supabase
        .from("reviews")
        .update(updateData)
        .eq("id", reviewId)
        .select()
        .single();
    if (updateError) throw updateError;

    return NextResponse.json(updatedReview);
}

async function deleteReview(body: any, supabase: any, userId: string) {
    const { reviewId } = body;
    if (!reviewId) {
        return NextResponse.json(
            { error: "Review ID is required" },
            { status: 400 }
        );
    }

    // Fetch existing review for ownership & item
    const { data: existingReview, error: fetchError } = await supabase
        .from("reviews")
        .select("item_id, user_id")
        .eq("id", reviewId)
        .single();
    if (fetchError) {
        return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    if (existingReview.user_id !== userId) {
        return NextResponse.json(
            { error: "Unauthorized to delete this review" },
            { status: 403 }
        );
    }

    const { error: deleteError } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);
    if (deleteError) throw deleteError;

    // RPC to decrement review count
    await supabase.rpc("decrement_review_count", { item_id: existingReview.item_id });

    return NextResponse.json({ success: true });
}
