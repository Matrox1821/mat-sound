import { toast } from "sonner";

export function Toast({ status }: { status: number | null }) {
  if (status === 200) {
    toast.custom((t) => (
      <div className="bg-green-500 w-[370px] rounded-sm p-1 absolute h-12 bottom-2 right-2">
        <h1 className="text-green-950 font-medium text-lg">Exitoso!</h1>
        <button
          className="m-1 absolute right-0 top-0 bg-white/50 rounded-full h-5 w-5 flex flex-col items-center justify-center"
          onClick={() => toast.dismiss(t)}
        >
          <span className="text-base align-middle pb-[2px] text-green-950">
            ×
          </span>
        </button>
      </div>
    ));
    return null;
  }

  if (status === null) return null;

  toast.custom((t) => (
    <div className="bg-red-500 w-[370px] rounded-sm p-1 absolute h-12 bottom-2 right-2">
      <h1>Error {status}</h1>
      <button
        className="m-1 absolute right-0 top-0 bg-white/50 rounded-full h-5 w-5 flex flex-col items-center justify-center"
        onClick={() => toast.dismiss(t)}
      >
        <span className="text-base align-middle pb-[2px]">×</span>
      </button>
    </div>
  ));
  return null;
}
