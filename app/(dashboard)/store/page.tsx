'use client'

import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

const getStores = async () => {
  const user = await getUserByClerkId();
};

const StorePage = () => {
  return <div>StorePage</div>;
};

export default StorePage;
