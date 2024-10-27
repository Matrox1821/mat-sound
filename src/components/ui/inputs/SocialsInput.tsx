import { useEffect, useState } from "react";

export function SocialsInput() {
  const [socialKey, setSocialKey] = useState("data");
  const [socialValue, setSocialValue] = useState("value");
  const [socialNames, setSocialNames] = useState<string[]>([]);

  const [social, setSocial] = useState<{ [key: string]: string }>();

  useEffect(() => {
    const inputKey = document.querySelector(".input-key");
    const inputValue = document.querySelector(".input-value");

    if (!inputKey || !inputValue) return;
    inputKey.addEventListener("input", (e: any) => {
      setSocialKey(e?.target?.value || "");
    });
    inputValue.addEventListener("input", (e: any) => {
      setSocialValue(e?.target?.value || "");
    });
    return () => {
      inputKey.removeEventListener("input", (e: any) => {
        setSocialKey(e?.target?.value || "");
      });
      inputValue.removeEventListener("input", (e: any) => {
        setSocialValue(e?.target?.value || "");
      });
    };
  }, []);

  const addSocial = () => {
    const data = {} as { [key: string]: string };
    data[socialKey] = socialValue;
    const newSocialNames = socialNames;
    setSocialNames([socialKey, ...newSocialNames]);
    setSocial(data);
  };
  const removeSocial = (socialName: string) => {
    const newSocialNames = socialNames.filter((name) => name !== socialName);
    const newSocial = { ...social };
    delete newSocial[socialName];
    setSocialNames(newSocialNames);
    setSocial(newSocial);
  };

  return (
    <div className="w-full relative flex flex-col">
      <label className="flex relative w-full z-10">
        <input
          value={JSON.stringify(social) || "none"}
          name="social"
          className="hidden"
          readOnly
        />
        <input
          className="input-key w-4/12 bg-[rgba(var(--bg))] border-2 border-[rgb(176,178,186)] rounded-md rounded-e-none h-8 focus-visible:border-[rgba(var(--accent),.9)] focus:border-2 outline-none py-4 pl-1"
          type="text"
          name="key"
        />
        <input
          className="input-value w-7/12 bg-[rgba(var(--bg))] border-2 border-[rgb(176,178,186)] border-x-0 h-8 focus-visible:border-[rgba(var(--accent),.9)] focus:border-2 outline-none py-4 pl-1 "
          type="text"
          name="value"
        />
        <button
          className="relative w-2/12 border-2 bg-[rgba(var(--bg))] pb-[.15rem] rounded-s-none rounded-md border-[rgb(176,178,186)] active:border-[rgba(var(--accent),.9)] active:text-[rgba(var(--accent),.9)]"
          onClick={addSocial}
          type="button"
        >
          +
        </button>
      </label>

      {socialNames.length > 0 && (
        <div className="border-2 border-[rgb(176,178,186)] rounded-b-md pt-2 -translate-y-3 z-0 table">
          {socialNames.map((socialName, i) => (
            <div
              className={
                socialNames.length === 1 || socialNames.length === i + 1
                  ? "flex relative w-full"
                  : "flex relative w-full border-b-2 border-[rgb(176,178,186)]"
              }
              key={socialName + i}
            >
              <span className="flex items-center w-full border-r-2 border-[rgb(176,178,186)] rounded-md rounded-e-none  h-8 focus-visible:border-[rgba(var(--accent),.9)] focus:border-2 outline-none py-4 pl-1">
                {socialName}:{social![socialName]}
              </span>
              <button
                className="relative z-0 w-2/12 pb-[.15rem] active:text-[rgba(var(--accent),.9)]"
                onClick={() => removeSocial(socialName)}
                type="button"
              >
                -
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
