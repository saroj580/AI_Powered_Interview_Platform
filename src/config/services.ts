/**
 * Services Configuration
 * Configuration for external services (AI, Storage, Email, etc.)
 */

import env from './env';

export const servicesConfig = {
  // Gemini AI Configuration
  gemini: {
    apiKey: env.GEMINI_API_KEY,
    model: 'gemini-1.5-pro',
    temperature: 0.7,
    maxTokens: 4096,
    timeout: 30000,
    maxRetries: 3,
  },
  
  // Cloudinary Configuration
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    uploadPreset: 'interviewai_uploads',
    folder: 'interviewai',
    allowedFormats: ['jpg', 'jpeg', 'png', 'pdf', 'docx'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  
  // Resend Email Configuration
  resend: {
    apiKey: env.RESEND_API_KEY,
    from: 'noreply@interviewai.com',
    replyTo: 'support@interviewai.com',
  },
  
  // Judge0 Configuration
  judge0: {
    apiUrl: env.JUDGE0_API_URL,
    apiKey: env.JUDGE0_API_KEY,
    timeout: 30000,
    maxRetries: 3,
  },
  
  // Redis Configuration (Future)
  redis: {
    url: env.REDIS_URL,
    keyPrefix: 'interviewai:',
    defaultTTL: 3600, // 1 hour
  },
  
  // Stripe Configuration (Future)
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  },
} as const;

export default servicesConfig;
