import { defineComponent, h } from 'vue';
import { AdBanner } from '@adsterra-ad/vue';

type AdLabelPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

type AdFormat = '300x250' | '160x300' | '728x90' | '468x60' | '320x50' | '160x600' | 'native';

type DemoItem =
  | { title: string; props: { adLabelPosition: AdLabelPosition } }
  | { title: string; props: { showAdLabel: false } };

const adKey = 'YOUR_ADSTERRA_KEY';

const formats: AdFormat[] = ['300x250', '160x300', '728x90', '468x60', '320x50', '160x600', 'native'];

const demoItems: DemoItem[] = [
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
    return () =>
      h('main', { class: 'page' }, [
        h('h1', 'Vue Example'),
        h('p', 'Testing label options and all ad formats for @adsterra-ad/vue.'),

        h('h2', 'Label Positions'),
        h(
          'section',
          { class: 'grid' },
          demoItems.map((item) =>
            h('article', { class: 'card', key: item.title }, [
              h('h3', item.title),
              h(AdBanner, { format: '300x250', adKey, ...item.props })
            ])
          )
        ),

        h('h2', 'All Formats'),
        h(
          'section',
          { class: 'grid' },
          formats.map((format) =>
            h('article', { class: 'card', key: format }, [
              h('h3', format),
              h(AdBanner, { format, adKey, adLabelPosition: 'top-center' })
            ])
          )
        )
      ]);
  }
});