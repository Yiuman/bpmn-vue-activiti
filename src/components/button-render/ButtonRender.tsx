import { defineComponent, PropType } from 'vue';
import { Button, ButtonRenderProps } from './index';
import { ElButton } from 'element-plus';
// import { createFromIconfontCN } from '@ant-design/icons-vue';
// const IconFont = createFromIconfontCN({
//   scriptUrl: '/public/iconfont.js',
// });
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
      default: () => null,
    },
  },
  setup(props: ButtonRenderProps) {
    return () => (
      <div class="button-render">
        {props.buttons.map((item) => {
          if (!item.icon) {
            return (
              <ElButton
                round
                type="info"
                {...{
                  onClick: (): void => (item.action ? item.action() : props.buttonClick(item)),
                }}
              >
                {item.label}
              </ElButton>
            );
          } else {
            return (
              <div
                class="render-icon"
                onClick={() => (item.action ? item.action() : props.buttonClick(item))}
              >
                <svg class="icon" aria-hidden="true">
                  <use xlinkHref={`#${item.icon}`}></use>
                </svg>
                {/* <icon-font type={item.icon} /> */}
              </div>
            );
          }
        })}
      </div>
    );
  },
});
