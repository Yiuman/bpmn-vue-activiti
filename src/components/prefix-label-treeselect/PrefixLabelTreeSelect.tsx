import { ElDialog, ElInput, ElTree} from 'element-plus';
import { defineComponent, PropType, computed } from 'vue';
import './prefix-label-treeselect.css';

const PrefixLabelTreeSelect = defineComponent({
  dialogTableVisible: false,
  dialogFormVisible: false,
  props: {
    ...ElTree.props,
    prefixTitle: {
      type: String as PropType<string>,
      default: () => '',
    },
    USER_OPTIONS_ARR: [
      {
        label: 'Level one 0',
        children: [
          {
            label: 'Level one 1',
            children: [
              {
                label: 'Level two 1-1',
                children: [
                  {
                    label: 'Level three 1-1-1',
                  },
                ],
              },
            ],
          },
          {
            label: 'Level one 2',
            children: [
              {
                label: 'Level two 2-1',
                children: [
                  {
                    label: 'Level three 2-1-1',
                  },
                ],
              },
              {
                label: 'Level two 2-2',
                children: [
                  {
                    label: 'Level three 2-2-1',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const computedModelValue = computed({
      get: () => props.value,
      set: (val) => emit('update:modelValue', val),
    });

    return () => (
      <div class="prefix-label-select-container">
        {props.prefixTitle && <div class="prefix-title ">{props.prefixTitle}</div>}
        <input type="text" onClick={aaaa} value="aaaa" />
      </div>
      //<ElDialog modelValue={PrefixLabelTreeSelect.dialogTableVisible} />
      //<el-dialog v-model="dialogTableVisible" title="Shipping address"></el-dialog>
    );
  },
});
const aaaa = (): void => {
  console.log(PrefixLabelTreeSelect.dialogTableVisible);
  PrefixLabelTreeSelect.dialogTableVisible = true;
};
export default PrefixLabelTreeSelect;
