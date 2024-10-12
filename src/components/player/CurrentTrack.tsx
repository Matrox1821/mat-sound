export function CurrentTrack({
  image,
  title,
  artist,
}: {
  image: string;
  title: string;
  artist: string;
}) {
  return (
    <div className="flex justify-center items-center w-full">
      <img src={image} alt={title} className="w-10 h-10 rounded-md" />
      <div className="flex flex-col p-2 justify-center items-start w-full">
        <h3 className="font-semibold text-base">{title}</h3>
        <span className="font-normal text-xs">{artist}</span>
      </div>
    </div>
  );
}
