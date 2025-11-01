// Migration script to add authorName to existing posts
// Run this once after adding the authorName attribute to your Appwrite collection

import appwriteService from '../appwrite/appwriteConfig.js';
import authService from '../appwrite/auth.js';

async function migratePostAuthors() {
    try {
        console.log('Starting migration...');
        
        // Get all posts
        const response = await appwriteService.getPosts([]);
        
        if (!response || !response.documents) {
            console.log('No posts found');
            return;
        }

        const posts = response.documents;
        console.log(`Found ${posts.length} posts`);

        // Get current user info (you need to be logged in)
        const currentUser = await authService.getCurrentUser();
        
        if (!currentUser) {
            console.error('You must be logged in to run this migration');
            return;
        }

        let updated = 0;
        let skipped = 0;

        for (const post of posts) {
            // Skip if already has authorName
            if (post.authorName) {
                console.log(`Post "${post.title}" already has author name: ${post.authorName}`);
                skipped++;
                continue;
            }

            try {
                // Check if this post belongs to the current user
                if (post.userId === currentUser.$id) {
                    // Update the post with current user's name
                    await appwriteService.updatePost({
                        slug: post.$id,
                        title: post.title,
                        content: post.content,
                        featuredImage: post.featuredImage,
                        status: post.status,
                        userId: post.userId,
                        authorName: currentUser.name
                    });
                    console.log(`✓ Updated post "${post.title}" with author: ${currentUser.name}`);
                    updated++;
                } else {
                    console.log(`⚠ Post "${post.title}" belongs to different user (${post.userId})`);
                    skipped++;
                }
            } catch (error) {
                console.error(`✗ Failed to update post "${post.title}":`, error);
            }
        }

        console.log('\n=== Migration Complete ===');
        console.log(`Updated: ${updated} posts`);
        console.log(`Skipped: ${skipped} posts`);
        
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

// Export for use in console or component
export default migratePostAuthors;

// Uncomment to run automatically (not recommended for production)
// migratePostAuthors();
