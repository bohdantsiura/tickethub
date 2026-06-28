// TicketHub Supabase Client

const SUPABASE_URL = "https://xckuzpfffsjgjltbbimk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MYbjg3hQ5-fB4O1lWMPO6w_-9mmTrEj";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

window.supabaseClient = supabase;