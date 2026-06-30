# HTTP Basic Authentication Setup Guide

This document explains how to set up HTTP Basic Authentication for your Vercel deployment.

## Overview

Your dashboard is now configured to require HTTP Basic Authentication. Users will see a browser login prompt before accessing the dashboard.

## Setup Instructions

### 1. Add Environment Variables to Vercel

1. Go to your Vercel project: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **Animated_Dashboard_Unibic_Map** project
3. Click on **Settings** → **Environment Variables**
4. Add two new environment variables:

| Name | Value | Description |
|------|-------|-------------|
| `AUTH_USER` | `your-username` | Your desired username for login |
| `AUTH_PASS` | `your-password` | Your desired password for login |

**Example:**
- `AUTH_USER` = `admin`
- `AUTH_PASS` = `SecurePassword123`

### 2. Redeploy Your Project

After adding the environment variables:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** button
4. Wait for the deployment to complete

### 3. Test the Authentication

Once deployed:
1. Visit your dashboard URL: https://animated-dashboard-unibic-map.vercel.app
2. A browser login prompt will appear
3. Enter the username and password you set in the environment variables
4. If correct, you'll be granted access to the dashboard

## How It Works

When a user tries to access your dashboard:
1. Vercel checks for the `Authorization` header
2. If not present, it returns a 401 response with a `WWW-Authenticate` header
3. This triggers the browser's native login prompt
4. The user enters credentials
5. If they match `AUTH_USER` and `AUTH_PASS`, access is granted
6. If incorrect, the prompt reappears

## Security Notes

✅ **Secure transmission**: HTTPS is enforced by Vercel (always use https://)
✅ **All requests protected**: Every request to your dashboard requires authentication
✅ **No client-side code exposure**: Authentication happens server-side

## Troubleshooting

**Still seeing 401 errors after redeployment?**
- Verify the environment variables are set correctly
- Make sure you've redeployed after adding the variables
- Check browser console for any errors

**Want to change credentials?**
1. Update the environment variables in Vercel settings
2. Redeploy the project
3. Clear browser cache if needed

**Want to disable authentication temporarily?**
1. Remove or rename the `vercel.json` file
2. Redeploy the project

---

**Last Updated**: June 2026
