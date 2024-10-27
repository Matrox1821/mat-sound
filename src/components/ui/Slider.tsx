import * as SliderPrimitive from "@radix-ui/react-slider";

import cn from "clsx";

const Slider = ({ className, ...props }: any) => (
  <form className="relative flex w-full touch-none select-none items-center">
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative grow rounded-full h-[3px] w-full bg-white/20 ">
        <SliderPrimitive.Range className="absolute bg-white rounded-full h-full " />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block w-2 h-2 bg-white rounded-[10px]"
        aria-label="Volume"
      />
    </SliderPrimitive.Root>
  </form>
);

export { Slider };
