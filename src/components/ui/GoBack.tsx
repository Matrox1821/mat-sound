import { IoIosArrowBack } from "react-icons/io";
export function GoBack() {
  return (
    <button
      onClick={() => window.history.back()}
      className="w-7 h-7 absolute mr-[0.15rem]"
    >
      <IoIosArrowBack className="w-7 h-7 text-white font-extrabold" />
    </button>
  );
}
