import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generate case ID function called');

    // Generate case ID using the same format as the database function
    // Format: CASE-YYYY-DDD-XXXX
    const now = new Date();
    const year = now.getFullYear();
    
    // Calculate day of year
    const start = new Date(year, 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Generate random 4-digit number
    const randomNum = Math.floor(Math.random() * 10000);
    
    // Format the case ID
    const caseId = `CASE-${year}-${dayOfYear.toString().padStart(3, '0')}-${randomNum.toString().padStart(4, '0')}`;
    
    console.log('Generated case ID:', caseId);

    return new Response(
      JSON.stringify({ 
        success: true,
        caseId: caseId,
        timestamp: now.toISOString()
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error generating case ID:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to generate case ID',
        details: error.message 
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500,
      },
    )
  }
})