import { getUserByBearerToken } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
    // const user = await getUserByBearerToken(request)
    const userId = request.headers.get('x-api-key');

    const {storeId, name, type, meta} = await request.json()

    if (!userId) {
        return NextResponse.json({error: 'User not found'}, {status: 404})
    }
    const store = await prisma.store.findFirst({
        where: {
            userId,
            id: storeId,
        },
    });
    if (!store) {
        return new Response('Store not found', { status: 404 });
    }

    const entry = await prisma.product.create({
        data: {
            storeId,
            name,
            type,
            meta
        }
    })

    return NextResponse.json({data: entry})
    
}

