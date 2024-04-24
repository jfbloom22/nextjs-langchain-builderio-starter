'use client'

import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

const getChatHistory = async () => {
  const user = await getUserByClerkId();
};

const ChatPage = () => {
  return <div>ChatPage</div>;
};

export default ChatPage;
