import { defineComponent, h } from 'vue';
import { AdBanner } from '@adsterra-ad/vue';

const demoItems = [
  { title: 'Top Left', props: { adLabelPosition: 'top-left' } },
  { title: 'Top Center', props: { adLabelPosition: 'top-center' } },
  { title: 'Top Right', props: { adLabelPosition: 'top-right' } },
  { title: 'Bottom Left', props: { adLabelPosition: 'bottom-left' } },
  { title: 'Bottom Center', props: { adLabelPosition: 'bottom-center' } },
  { title: 'Bottom Right', props: { adLabelPosition: 'bottom-right' } },
  { title: 'Hidden Label', props: { showAdLabel: false } }
];

export default defineComponent({
  name: 'App',
  setup() {
    return () => h('main', { class: 'page' }, [
      h('h1', 'Vue Example'),
      h('p', 'Testing every label option for @adsterra-ad/vue.'),
      h('section', { class: 'grid' },
        demoItems.map((item) =>
          h('article', { class: 'card', key: item.title }, [
            h('h3', item.title),
            h(AdBanner, { format: '300x250', ...item.props })
          ])
        )
      )
    ]);
  }
});