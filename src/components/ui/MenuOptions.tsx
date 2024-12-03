import { formatTime } from "src/shared/helpers";
import { usePlayerStore } from "src/store/playerStore";
import type { trackProps } from "src/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./Dropdown";

export function MenuOptions({ track }: { track: trackProps }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>Open</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent id="hola">
        <DropdownMenuLabel>
          <img
            src={track.image}
            alt={track.name}
            className="object-fill aspect-square w-12 rounded-sm"
          />
          <span>
            <h3>{track.name}</h3>
            {track.artist?.name && (
              <span>
                {track.artist?.name} • {formatTime(track.seconds)}
              </span>
            )}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {track.artist && (
            <DropdownMenuItem>
              <a href={`/artist/${track.artist.id}`}>Ir al artista</a>
            </DropdownMenuItem>
          )}
          {track.album && (
            <DropdownMenuItem>
              <a href={`/artist/${track.album.id}`}>Ir al álbum</a>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <a href={`/track/${track.id}`}>Ir a la canción</a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
