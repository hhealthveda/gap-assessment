import { db } from './db';
import { assessments } from '@shared/schema';

async function seed() {
  console.log('🌱 Seeding database...');
  
  // Check if we already have assessments
  const existingAssessments = await db.select().from(assessments);
  
  if (existingAssessments.length === 0) {
    console.log('Creating initial assessments...');
    
    // Create Level 1 Assessment
    await db.insert(assessments).values({
      name: 'CMMC Initial Assessment',
      level: 'level1',
      organizationName: 'Example Organization',
      completedPercentage: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Create Level 2 Assessment
    await db.insert(assessments).values({
      name: 'CMMC Level 2 Assessment',
      level: 'level2',
      organizationName: 'Example Organization',
      completedPercentage: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Initial assessments created.');
  } else {
    console.log(`Found ${existingAssessments.length} existing assessments. No need to seed.`);
  }
  
  console.log('Seeding completed.');
}

// We'll only call the seed function from main app instead of trying to detect if it's the main module
// since we're using ES modules

export { seed };