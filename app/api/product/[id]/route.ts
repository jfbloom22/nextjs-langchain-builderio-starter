import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request, { params }: { params: { id: string, storeId: string } }) => {
    const { id, storeId } = params;
    const { name } = await request.json();
    const user  = await getUserByClerkId();
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }
    const store = await prisma.store.findFirst({
        where: {
            userId: user.id,
            id: storeId,
        },
    });
    if (!store) {
        return new Response('Store not found', { status: 404 });
    }
    const updatedStore = await prisma.product.update({
        where: {
            storeId: store.id,
            id,
        },
        data: {
            name
        }
    });
    return NextResponse.json({data: updatedStore})
}

