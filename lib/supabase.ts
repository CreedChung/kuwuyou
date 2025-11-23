import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

console.log("Supabase 配置:", {
	url: supabaseUrl,
	hasKey: !!supabaseAnonKey,
	keyLength: supabaseAnonKey.length,
});

if (!supabaseUrl || !supabaseAnonKey) {
	console.warn(
		"Missing Supabase environment variables. Please check your .env file.",
	);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
	},
});

console.log("Supabase 客户端已创建");

export type Database = {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					username: string;
					email: string;
					avatar_url: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					username: string;
					email: string;
					avatar_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					username?: string;
					email?: string;
					avatar_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
		};
	};
};
