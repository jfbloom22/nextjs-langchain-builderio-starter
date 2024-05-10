import { getUserByBearerToken } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (request: NextRequest, { params }: { params: { id: string, storeId: string } }) => {
    const { id, storeId } = params;
    const { name, meta, location, quantity, unit, price, type } = await request.json();
    const user = await getUserByBearerToken(request)
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
            name,
            meta,
            type,
            location,
            quantity,
            unit,
            price,
        }
    });
    return NextResponse.json({data: updatedStore})
}

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    const user = await getUserByBearerToken(request)
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }
    const product = await prisma.product.findFirst({
        where: {
            id,
        }
    })
    return NextResponse.json({data: product})
}

export const DELETE = async (request: NextRequest, { params }: { params: { id: string, storeId: string } }) => {
    const { id, storeId } = params;
    const user = await getUserByBearerToken(request)
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }
    const deletedProduct = await prisma.product.delete({
        where: {
            storeId,
            id,
        }
    })
    return NextResponse.json({data: deletedProduct})
}

