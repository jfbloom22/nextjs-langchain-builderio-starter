import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    const { id } = params;
    const { name } = await request.json();
    const user  = await getUserByClerkId();
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }
    const updatedStore = await prisma.store.update({
        where: {
            userId: user.id,
            id,
        },
        data: {
            name
        }
    });
    return NextResponse.json({data: updatedStore})
}

