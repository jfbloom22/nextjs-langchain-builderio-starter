import { getUserByBearerToken } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    const { name } = await request.json();
    // const user = await getUserByBearerToken(request)
    const userId = request.headers.get('x-api-key');

    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }
    const updatedStore = await prisma.store.update({
        where: {
            userId,
            id,
        },
        data: {
            name
        }
    });
    return NextResponse.json({data: updatedStore})
}

