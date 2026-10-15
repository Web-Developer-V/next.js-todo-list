// "use server";

// import { createClient } from "@/lib/supabase/server";

// interface Profile {
//   id: string;
//   nickname: string;
// }

// export async function createProfile({ id, nickname }: Profile) {
//   const supabase = await createClient();

//   const { error } = await supabase.from("profiles").insert({
//     id,
//     nickname,
//   });

//   if (error) {
//     return {
//       success: false,
//       message: error.message,
//       code: error.code,
//     };
//   }

//   return { success: true };
// }
