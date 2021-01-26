import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

//直接获取文件的text
function rawTransform(
  fileRegex: Array<RegExp>,
): {
  name: string;
  transform: (src: string, id: string) => string | void;
} {
  return {
    name: 'get-file-raw',
    transform(src, id): string | void {
      if (fileRegex.filter((re) => re.test(id)).length > 0) {
        return `export default ${JSON.stringify(src)}`;
      }
    },
  };
}
export default {
  optimizeDeps: {
    include: ['bpmn-js/lib/Modeler', '@ant-design/icons-vue'],
  },
  plugins: [vue(), rawTransform([/\.bpmn$/]), vueJsx()],
};
