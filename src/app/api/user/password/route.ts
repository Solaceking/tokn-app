import { NextResponse } from 'next/server';
import { getAuthenticatedUser, USE_LOCAL_AUTH, updateUserPassword } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    
    if (USE_LOCAL_AUTH) {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: 'Current and new password are required' },
          { status: 400 }
        );
      }
      
      const success = await updateUserPassword(user.id, newPassword);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to update password' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Password change not available for this auth mode' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}