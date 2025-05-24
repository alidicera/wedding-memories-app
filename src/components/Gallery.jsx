import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Gallery({ code, refresh = 0 }) {
  const [media, setMedia] = useState([]);

  /* helper signed-URL pubblico */
  const publicUrl = path =>
    supabase.storage.from("wedding-media").getPublicUrl(path).data.publicUrl;

  /* scarica la lista media quando cambia `code` o `refresh` */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("media")
        .select("id, path, mime")
        .eq("code", code)
        .order("created_at", { ascending: false });
      if (!error) setMedia(data);
    })();
  }, [code, refresh]);

  if (!media.length) {
    return <p className="text-gray-500 text-center">Nessun ricordo ancora… ✨</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {media.map(item =>
        item.mime.startsWith("image") ? (
          <img
            key={item.id}
            src={publicUrl(item.path)}
            alt=""
            loading="lazy"
            className="rounded-lg w-full h-64 object-cover"
          />
        ) : (
          <video
            key={item.id}
            controls
            preload="metadata"
            src={publicUrl(item.path)}
            className="rounded-lg w-full h-64 object-cover"
          />
        )
      )}
    </div>
  );
}









