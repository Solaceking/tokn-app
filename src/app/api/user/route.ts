import { NextResponse } from 'next/server';
import { getAuthenticatedUser, USE_LOCAL_AUTH } from '@/lib/auth';
import { db } from '@/lib/db';
import { updateUserPassword } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      plan: user.plan,
      createdAt: null,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, avatar_url } = body;
    
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.full_name = name;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    
    const updatedUser = await db.users.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        created_at: true,
      },
    });
    
    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.full_name,
      avatar_url: updatedUser.avatar_url,
      createdAt: updatedUser.created_at,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await db.users.delete({
      where: { id: user.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}