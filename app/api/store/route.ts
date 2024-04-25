import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { ExtendedNextApiRequest } from "../../../middleware"
import { getUserByClerkIdBearer } from "@/utils/auth"

export const POST = async (req: ExtendedNextApiRequest) => {
    // const user = await getUserByClerkId()
    const userString = req.headers.get('user')
    if (!userString) {
        return NextResponse.json({error: 'User not found'}, {status: 404})
    }
    console.log('made it here')
    const user = await getUserByClerkIdBearer(JSON.parse(userString).user_id)
    // const user = JSON.parse(userString);
    console.log('did we make it here', user)
    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404})
    }

    const {name} = await req.json()

    const entry = await prisma.store.create({
        data: {
            userId: user.id,
            name,
            
        }
    })

    revalidatePath('/store')

    return NextResponse.json({data: entry})
    
}