import { defineComponent } from 'vue';
import ButtonRender, { ButtonRenderProps } from '../../components/button-render';
import { useBpmnInject } from '../../bpmn/store';
// import buttonSvg from './buttons';
import './bpmn-actions.css';

export default defineComponent({
  name: 'BpmnActions',
  setup() {
    const bpmnContext = useBpmnInject();
    const buttonRenderProps: ButtonRenderProps = {
      buttons: [
        { label: '导入', icon: 'icon-shangchuan' },
        { label: '导出SVG', icon: 'icon-zu920' },
        { label: '导出XML', icon: 'icon-zu1359' },
        { label: '放大', icon: 'icon-fangda' },
        { label: '缩小', icon: 'icon-suoxiao' },
        { label: '预览', icon: 'icon-xianshi' },
      ],
      buttonClick: (btn) => {
        console.warn(btn);
      },
    };

    console.warn(bpmnContext);

    return () => (
      <div class="bpmn-actions">
        <ButtonRender {...buttonRenderProps} />
      </div>
    );
  },
});
