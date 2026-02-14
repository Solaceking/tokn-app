/**
 * Client-side token utilities
 * 
 * IMPORTANT: These functions are for DISPLAY MASKING only, NOT encryption.
 * Real encryption must always happen server-side using server-encryption.ts
 * 
 * Never use these functions to secure sensitive data - they provide no security,
 * only visual masking for UI display purposes.
 */

/**
 * Encode token for localStorage storage (base64 only)
 * This is NOT encryption - it only prevents casual browsing of localStorage
 * Real encryption happens server-side using server-encryption.ts
 */
export function encodeForStorage(text: string): string {
  try {
    return btoa(encodeURIComponent(text));
  } catch {
    return text;
  }
}

/**
 * Decode token from localStorage storage
 */
export function decodeFromStorage(encoded: string): string {
  try {
    return decodeURIComponent(atob(encoded));
  } catch {
    return encoded;
  }
}

/**
 * Mask a token for display (show first 3 and last 4 characters)
 * This is NOT encryption - it only obscures the token visually
 */
export function maskToken(token: string): string {
  if (!token || token.length < 8) return token;
  
  const prefixLength = 3;
  const suffixLength = 4;
  
  const prefix = token.slice(0, prefixLength);
  const suffix = token.slice(-suffixLength);
  const masked = '•'.repeat(Math.min(token.length - prefixLength - suffixLength, 12));
  
  return `${prefix}${masked}${suffix}`;
}

/**
 * Copy text to clipboard with auto-clear
 */
export async function copyToClipboard(
  text: string, 
  autoClearMs: number = 30000
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    
    // Auto-clear clipboard after specified time
    if (autoClearMs > 0) {
      setTimeout(async () => {
        try {
          await navigator.clipboard.writeText('');
        } catch {
          // Ignore clear errors
        }
      }, autoClearMs);
    }
    
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return formatDate(d);
}
