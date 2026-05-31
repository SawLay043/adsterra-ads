import { defineComponent, h } from 'vue';
import { AdBanner, configureAds } from '@adsterra-ad/vue';

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

configureAds({
  '300x250': 'YOUR_300x250_KEY',
  '160x300': 'YOUR_160x300_KEY',
  '728x90': 'YOUR_728x90_KEY',
  '468x60': 'YOUR_468x60_KEY',
  '320x50': 'YOUR_320x50_KEY',
  '160x600': 'YOUR_160x600_KEY',
  native: 'YOUR_NATIVE_KEY'
});

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
              h(AdBanner, { format: '300x250', ...item.props, showFallbackPlaceholder: true })
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
              h(AdBanner, { format, adLabelPosition: 'top-center' })
            ])
          )
        )
      ]);
  }
});
