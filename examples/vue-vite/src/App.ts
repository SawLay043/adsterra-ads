import { defineComponent, h } from 'vue';
import { AdBanner } from '@adsterra-ad/vue';

export default defineComponent({
  name: 'App',
  setup() {
    return () => h('main', { class: 'page' }, [
      h('h1', 'Vue Example'),
      h('p', 'Testing @adsterra-ad/vue package.'),
      h(AdBanner, { format: '300x250' }),
      h(AdBanner, { format: '728x90' })
    ]);
  }
});