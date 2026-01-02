import "primereact/stepper";

declare module "primereact/stepper" {
  interface StepperProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }
}
