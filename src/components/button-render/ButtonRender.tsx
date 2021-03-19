import { defineComponent, PropType } from 'vue';
import { Button, ButtonRenderProps } from './index';
import { ElButton, ElTooltip } from 'element-plus';

export default defineComponent({
  name: 'ButtonRender',

  props: {
    buttons: {
      type: Array as PropType<Array<Button>>,
      require: true,
      default: () => [],
    },
    buttonClick: {
      type: Function as PropType<(btn: Button) => void>,
      default: () => (item: any) => {
        console.log(item);
      },
    },
  },
  setup(props: ButtonRenderProps) {
    const globalClick = (item: any) => {
      if (props.buttonClick) {
        props.buttonClick(item);
      }
    };
    return () => (
      <div class="button-render">
        {props.buttons.map((item) => {
          if (!item.icon) {
            return (
              <ElButton
                round
                type="info"
                {...{
                  onClick: (): void => (item.action ? item.action() : globalClick(item)),
                }}
              >
                {item.label}
              </ElButton>
            );
          } else {
            const tooltipProps = {
              effect: 'light',
              content: item.label,
              placement: 'top',
              offset: 10,
              'open-delay': 300,
            };

            return (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              <ElTooltip class="render-icon-tooltip" {...tooltipProps}>
                <div
                  class="render-icon"
                  onClick={() => (item.action ? item.action() : globalClick(item))}
                >
                  <svg class="icon" aria-hidden="true">
                    <use xlinkHref={`#${item.icon}`} />
                  </svg>
                </div>
              </ElTooltip>
            );
          }
        })}
      </div>
    );
  },
});
