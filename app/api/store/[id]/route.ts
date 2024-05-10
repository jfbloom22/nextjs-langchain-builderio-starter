import { getUserByBearerToken } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    const { name } = await request.json();
    const user = await getUserByBearerToken(request)
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

// get store with all products
export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    const user = await getUserByBearerToken(request)
    const products = await prisma.product.findMany({
        where: {
            storeId: id,
        }
    })
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }
    const store = await prisma.store.findFirst({
        where: {
            userId: user.id,
            id,
        },
        include: {
            products: true,
        }
    })
    return NextResponse.json({data: {store, products}})
}

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    const user = await getUserByBearerToken(request)
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }
    const deletedStore = await prisma.store.delete({
        where: {
            userId: user.id,
            id,
        }
    });
    return NextResponse.json({data: deletedStore})
}

