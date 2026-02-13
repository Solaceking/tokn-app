import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { encryptToken } from '@/lib/server-encryption';

// GET all tokens for the current user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: tokens, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Get tokens error:', error);
      return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 });
    }
    
    return NextResponse.json(tokens || []);
  } catch (error) {
    console.error('Get tokens error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create a new token
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { service, token, description, category, status } = body;
    
    if (!service || !token) {
      return NextResponse.json(
        { error: 'Service and token are required' },
        { status: 400 }
      );
    }
    
    // Encrypt the token before storing
    const encryptedToken = encryptToken(token);
    
    const { data: newToken, error } = await supabase
      .from('tokens')
      .insert({
        service,
        token: encryptedToken,
        description: description || '',
        category: category || 'Other',
        status: status || 'ACTIVE',
        user_id: user.id,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Create token error:', error);
      return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
    }
    
    return NextResponse.json(newToken);
  } catch (error) {
    console.error('Create token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH update a token
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, service, token, description, category, status } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Token ID is required' }, { status: 400 });
    }
    
    const updateData: any = {};
    if (service) updateData.service = service;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (status) updateData.status = status;
    if (token) updateData.token = encryptToken(token);
    
    const { data: updatedToken, error } = await supabase
      .from('tokens')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Update token error:', error);
      return NextResponse.json({ error: 'Failed to update token' }, { status: 500 });
    }
    
    return NextResponse.json(updatedToken);
  } catch (error) {
    console.error('Update token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a token
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Token ID is required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('tokens')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Delete token error:', error);
      return NextResponse.json({ error: 'Failed to delete token' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
