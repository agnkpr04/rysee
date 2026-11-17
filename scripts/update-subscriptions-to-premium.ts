import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateSubscriptionsToPremium() {
  try {
    console.log('Updating subscriptions from PRO/ELITE to PREMIUM...');
    
    // Update all 'pro' subscriptions to 'premium'
    const proResult = await prisma.subscription.updateMany({
      where: {
        plan: 'pro',
      },
      data: {
        plan: 'premium',
      },
    });
    
    console.log(`Updated ${proResult.count} 'pro' subscriptions to 'premium'`);
    
    // Update all 'elite' subscriptions to 'premium'
    const eliteResult = await prisma.subscription.updateMany({
      where: {
        plan: 'elite',
      },
      data: {
        plan: 'premium',
      },
    });
    
    console.log(`Updated ${eliteResult.count} 'elite' subscriptions to 'premium'`);
    
    console.log('Subscription update completed successfully!');
  } catch (error) {
    console.error('Error updating subscriptions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateSubscriptionsToPremium();
