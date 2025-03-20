// /api/save.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, code, language } = req.body;
    if (!name || !code || !language) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from('snippets')
      .insert([{ name, code, language }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ id: data.id });
  } else if (req.method === "GET") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "No id provided" });
    }

    const { data, error } = await supabase
      .from('snippets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: "Snippet not found" });
    }

    return res.status(200).json(data);
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
