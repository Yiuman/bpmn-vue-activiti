import { defineComponent, PropType } from 'vue';
import { Button, ButtonRenderProps } from './index';
import { createFromIconfontCN } from '@ant-design/icons-vue';
const IconFont = createFromIconfontCN({
  scriptUrl: '/public/iconfont.js',
});
export default defineComponent({
  name: 'ButtonRender',
  components: {
    IconFont,
  },
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
            return <a-button click={props.buttonClick(item)}>{item.label}</a-button>;
          } else {
            return (
              <div
                class="render-icon"
                onClick={() => (item.action ? item.action() : props.buttonClick(item))}
              >
                <icon-font type={item.icon} />
              </div>
            );
          }
        })}
      </div>
    );
  },
});
