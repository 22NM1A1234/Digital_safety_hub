import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportData {
  incident_type: string
  urgency: string
  description: string
  location?: string
  incident_date?: string
  is_anonymous?: boolean
  contact_email?: string
  contact_phone?: string
  evidence_files?: string[]
}

function generateCaseId(): string {
  const now = new Date()
  const year = now.getFullYear()
  const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const randomNum = Math.floor(Math.random() * 10000)
  
  return `CASE-${year}-${dayOfYear.toString().padStart(3, '0')}-${randomNum.toString().padStart(4, '0')}`
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Submit report function called')
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Set the auth token for the request
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      throw new Error('Unauthorized')
    }

    console.log('User authenticated:', user.id)

    // Parse request body
    const reportData: ReportData = await req.json()
    console.log('Report data received:', reportData)

    // Generate case ID
    const caseId = generateCaseId()
    console.log('Generated case ID:', caseId)

    // Prepare the incident report data
    const incidentData = {
      user_id: user.id,
      case_id: caseId,
      incident_type: reportData.incident_type,
      urgency: reportData.urgency,
      description: reportData.description,
      location: reportData.location || null,
      incident_date: reportData.incident_date ? new Date(reportData.incident_date).toISOString() : null,
      is_anonymous: reportData.is_anonymous || false,
      contact_email: reportData.contact_email || null,
      contact_phone: reportData.contact_phone || null,
      evidence_files: reportData.evidence_files || null,
      status: 'pending'
    }

    console.log('Inserting incident report:', incidentData)

    // Insert the incident report
    const { data: insertedReport, error: insertError } = await supabase
      .from('incident_reports')
      .insert([incidentData])
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      throw new Error(`Failed to submit report: ${insertError.message}`)
    }

    console.log('Report submitted successfully:', insertedReport)

    return new Response(
      JSON.stringify({
        success: true,
        case_id: caseId,
        report_id: insertedReport.id,
        message: 'Report submitted successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in submit-report function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})