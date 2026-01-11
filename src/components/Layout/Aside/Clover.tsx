"use client";
import { Dialog } from "primereact/dialog";
import { SVGProps, useEffect, useState } from "react";

export function Clover({ className, ...props }: SVGProps<SVGSVGElement>) {
  const [clicks, setClicks] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [pass, setPass] = useState("");

  const onClick = () => {
    const nuevoValor = clicks + 1;
    setClicks(nuevoValor);

    if (nuevoValor % 10 === 0) {
      setTimeout(() => {
        setVisible(true);
      }, 800);
    }
  };
  useEffect(() => {
    const adminPassToPath = process.env.NEXT_PUBLIC_ADMIN_PASS_TO_PATH;
    const keyPressed = (e: any) => {
      setPass((prev) => {
        const nuevaClave = prev + e.key;
        if (nuevaClave === adminPassToPath) {
          setIsVerified(true);
          setTimeout(() => {
            window.location.href = "/admin/signin";
          }, 800);
          return "";
        }

        return nuevaClave;
      });
    };

    if (visible) {
      window.addEventListener("keydown", keyPressed);

      return () => {
        window.removeEventListener("keydown", keyPressed);
      };
    }
  }, [visible, pass]);
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="115"
        viewBox="0 0 120 115"
        {...props}
        className={`${className} ${clicks % 10 === 0 ? "spin" : ""}`}
        onClick={onClick}
      >
        <path
          d="M74.7 64.4c-2 9.5 18.5 7.5 27 16 6.5 6.5 4 28.5-11 24.5-2.5 13-21.6 9.7-25 1.5-5.7-14 6.3-30-6-33.5-12.5 3-1.2 27.3-5.7 34.5-4.5 7.2-23 13-27-3-15.5.5-16.7-12.8-12-20.5 4.4-7.2 32.7-6 28-19.5-10.3-8-11.5 8.8-30.3 7-10-1-19.5-11-6-25-10-18 9-25 18-21.5 12.7 5 13.2 26 25 22 7.5-12-12.7-14.5-14.7-32-.6-5 5.5-22 24-11 21-11 27.6 3.8 26 11.5-2.4 12-22.5 20.5-17.3 31.5 11.8 2 11.5-13.7 26.3-23 8-5 25.5 4 18 19 11.5 8 9.2 25.4-5.5 26-12.5.5-25.8-13-31.8-4.5z"
          fill="currentColor"
        />
      </svg>
      <Dialog
        header="Header"
        visible={visible}
        focusOnShow={false}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className={`${isVerified ? "text-green-300" : ""}`}>
          {isVerified ? "Accediste exitosamente!" : "Intenta descifrar la clave"}
        </div>
      </Dialog>
    </div>
  );
}
