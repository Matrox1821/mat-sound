import { supabase } from "src/lib/supabase";
import { getTracks } from "src/queryFn";

export function Search() {
  const drawPerson = async () => {
    const { data } = await supabase.from("tracks").select("*").range(0, 0);
    if (!data) {
      console.error("No data returned");
      return;
    }
  };
  return <input onChange={drawPerson}></input>;
}
