import ButtonRender from './ButtonRender';

export interface Button {
  label: string;
  icon: string;
}

export interface ButtonRenderProps {
  buttons: Array<Button>;
  buttonClick: (btn: Button) => void;
}
export default ButtonRender;
