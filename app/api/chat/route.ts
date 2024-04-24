import { getUserByClerkId } from "@/utils/auth"

export const POST = async () => {
    const user = await getUserByClerkId()
    
}

