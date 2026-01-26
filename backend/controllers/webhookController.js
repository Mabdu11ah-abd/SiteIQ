import { Webhook } from 'svix';
import User from '../models/User.js';

export const handleClerkWebhook = async (req, res) => {
    console.log('Webhook received:', req.body);
    try {
        const rawBody = req.body;                // this is now a Buffer
        const signatureHeaders = {
            'svix-id': req.header('svix-id'),
            'svix-timestamp': req.header('svix-timestamp'),
            'svix-signature': req.header('svix-signature'),
        };


        // Verify webhook signature
        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
        const event = webhook.verify(rawBody, signatureHeaders);
        const eventType = event.type;
        console.log('Verified event object:', JSON.stringify(event, null, 2));

        if (eventType === 'user.created') {
            // Handle new user creation (more tolerant parsing)
            const data = event.data || {};
            const id = data.id || data.user_id || null;

            // Email extraction: support several possible Clerk field shapes
            const email = data.email_addresses?.[0]?.email_address || data.primary_email_address?.email_address || data.primary_email_address?.email || data.email || data.email_address || null;

            // Name extraction: support snake_case and camelCase and full name fallback
            const first_name = data.first_name || data.firstName || "";
            const last_name = data.last_name || data.lastName || "";
            let name = [first_name, last_name].filter(Boolean).join(' ').trim();
            if (!name) name = data.name || data.full_name || null;

            // Phone and profile image fallbacks
            const phoneNumber = data.phone_numbers?.[0]?.phone_number || data.phone || null;
            const image = data.profile_image_url || data.avatar_url || data.profile_image || null;

            // Username: prefer explicit username, else derive from email; ensure uniqueness
            let username = (data.username || (email ? email.split('@')[0] : null) || id)?.toString();
            if (username) {
                // sanitize and limit length
                const base = username.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30) || `user${Date.now()}`;
                let candidate = base;
                let i = 1;
                // Ensure uniqueness (avoid infinite loop)
                while (await User.findOne({ username: candidate })) {
                    candidate = `${base}${i++}`;
                    if (i > 100) break;
                }
                username = candidate;
            }

            // email is required for creating a user in our schema
            if (!email) {
                console.error('Missing required email in Clerk user.created payload:', JSON.stringify(data));
                return res.status(400).json({
                    success: false,
                    message: 'Required email field is missing from webhook payload',
                });
            }

            // Final fallbacks for name/username
            const finalName = name || username || email.split('@')[0];
            const finalUsername = username || (email ? email.split('@')[0] : `user${Date.now()}`);

            const newUser = new User({
                clerkUserId: id,
                name: finalName,
                username: finalUsername,
                email,
                phoneNumber,
                image: image || 'default-avatar.jpg',
                isVerified: true,
            });

            await newUser.save();
            console.log('User created:', newUser);

            return res.status(200).json({
                success: true,
                message: 'User created and webhook processed successfully',
            });
        } else if (eventType === 'session.created') {
            // Handle login event: increment loginCount on each session creation (login)
            const clerkUserId = event.data.user_id;
            console.log('User logged in with ID:', clerkUserId);
            const user = await User.findOneAndUpdate(
                { clerkUserId: clerkUserId },
                { $inc: { loginCount: 1 } },
                { new: true }
            );
            if (!user) {
                console.error(`User with ID ${clerkUserId} not found for login update.`);
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
            console.log('Login count incremented for user:', user);
            return res.status(200).json({
                success: true,
                message: 'Login count incremented successfully',
            });
        } else if (eventType === 'user.updated') {
            // Handle user info update when a user updates their details on Clerk
            const { id } = event.data; // Clerk user ID
            const { first_name, last_name, email_addresses, profile_image_url, phone_numbers } = event.data;
            const email = email_addresses?.[0]?.email_address || null;
            const phoneNumber = phone_numbers?.[0]?.phone_number || null;
            const name = `${first_name} ${last_name}`;
            const username = email?.split('@')[0]; // Regenerate username based on updated email

            const updatedUser = await User.findOneAndUpdate(
                { clerkUserId: id },
                {
                    name,
                    username,
                    email,
                    phoneNumber,
                    image: profile_image_url || 'default-avatar.jpg'
                },
                { new: true }
            );

            if (!updatedUser) {
                console.error(`User with ID ${id} not found for update.`);
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            console.log('User updated:', updatedUser);
            return res.status(200).json({
                success: true,
                message: 'User info updated successfully',
            });
        } else if (eventType === 'user.deleted') {
            // Delete user and related data when a user is deleted on Clerk
            const { id } = event.data;
            const user = await User.findOneAndDelete({ clerkUserId: id });
            if (!user) {
                console.error(`User with ID ${id} not found in MongoDB.`);
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
            console.log('User deleted with ID:', id);
            return res.status(200).json({
                success: true,
                message: 'User and related data deleted successfully',
            });
        } else {
            console.log('Unhandled event type:', eventType);
            return res.status(400).json({
                success: false,
                message: `Unhandled event type: ${eventType}`,
            });
        }
    } catch (error) {
        console.error('Error processing webhook:', error.message);
        return res.status(400).json({
            success: false,
            message: 'Webhook verification failed',
        });
    }
}