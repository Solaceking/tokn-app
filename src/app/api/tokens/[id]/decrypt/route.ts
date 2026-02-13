import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { decryptToken } from '@/lib/server-encryption';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    
    const { data: token, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error || !token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }
    
    // Decrypt the token
    const decrypted = decryptToken(token.token);
    
    return NextResponse.json({ token: decrypted });
  } catch (error) {
    console.error('Decrypt token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
