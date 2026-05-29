import { defineComponent, h, onMounted, onUnmounted, ref, watch, computed, type PropType } from 'vue';
import {
  DEFAULT_AD_CONFIGS,
  buildSrcDoc,
  createBannerId,
  type AdFormat,
  type AdProvider,
  type BannerMessage
} from '@adsterra-ad/core';

type AdLabelPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export const AdBanner = defineComponent({
  name: 'AdBanner',
  props: {
    format: { type: String as PropType<AdFormat>, required: true },
    provider: { type: String as PropType<AdProvider>, default: 'adsterra' },
    adLabel: { type: String, default: 'Advertisement' },
    showAdLabel: { type: Boolean, default: true },
    adLabelPosition: { type: String as PropType<AdLabelPosition>, default: 'top-left' },
    className: { type: String, default: '' }
  },
  emits: ['load', 'error'],
  setup(props, { emit }) {
    const bannerId = createBannerId();
    const adLoaded = ref(false);
    const adFailed = ref(false);
    const activeProvider = ref<AdProvider>(props.provider);

    watch(() => props.provider, (next) => { activeProvider.value = next; });

    const config = computed(() => DEFAULT_AD_CONFIGS[props.format]);
    const srcDoc = computed(() =>
      buildSrcDoc({ format: props.format, provider: activeProvider.value, config: config.value, bannerId })
    );

    const style = computed(() => ({
      width: typeof config.value.width === 'number' ? `${config.value.width}px` : config.value.width,
      height: typeof config.value.height === 'number' ? `${config.value.height}px` : config.value.height,
      overflow: 'hidden',
      borderRadius: '6px',
      border: '1px solid #e5e7eb',
      background: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }));

    const wrapperStyle = computed(() => ({
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: props.adLabelPosition.endsWith('left') ? 'flex-start' : props.adLabelPosition.endsWith('right') ? 'flex-end' : 'center'
    }));

    const labelStyle = computed(() => ({
      fontSize: '10px',
      fontWeight: '600',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#9ca3af',
      marginBottom: props.adLabelPosition.startsWith('top') ? '4px' : '0',
      marginTop: props.adLabelPosition.startsWith('bottom') ? '4px' : '0',
      textAlign: props.adLabelPosition.endsWith('left') ? 'left' : props.adLabelPosition.endsWith('right') ? 'right' : 'center',
      width: '100%'
    }));

    const onMessage = (event: MessageEvent<BannerMessage>) => {
      const data = event.data;
      if (!data || data.bannerId !== bannerId) return;
      if (data.type === 'ad-load-success') {
        adLoaded.value = true;
        emit('load');
        return;
      }
      if (data.type === 'ad-load-error') {
        adFailed.value = true;
        emit('error');
      }
    };

    onMounted(() => window.addEventListener('message', onMessage));
    onUnmounted(() => window.removeEventListener('message', onMessage));

    return () => {
      if (adFailed.value) return null;
      const hiddenClass = adLoaded.value ? 'scale-100 opacity-100' : 'pointer-events-none absolute h-0 w-0 scale-95 overflow-hidden opacity-0';
      const topLabel = props.showAdLabel && props.adLabelPosition.startsWith('top');
      const bottomLabel = props.showAdLabel && props.adLabelPosition.startsWith('bottom');

      return h('div', { class: `${props.className} ${hiddenClass}`.trim(), style: wrapperStyle.value }, [
        topLabel ? h('span', { style: labelStyle.value }, props.adLabel) : null,
        h('div', { 'data-testid': 'ad-banner', style: style.value }, [
          h('iframe', {
            title: 'Advertisement',
            srcdoc: srcDoc.value,
            frameborder: '0',
            scrolling: 'no',
            sandbox: 'allow-scripts allow-forms allow-same-origin allow-popups allow-modals'
          })
        ]),
        bottomLabel ? h('span', { style: labelStyle.value }, props.adLabel) : null
      ]);
    };
  }
});

export const AdContainer = defineComponent({
  name: 'AdContainer',
  props: {
    format: { type: String as PropType<AdFormat>, required: true },
    provider: { type: String as PropType<AdProvider>, default: 'adsterra' },
    className: { type: String, default: '' },
    adLabel: { type: String, default: 'Advertisement' },
    showAdLabel: { type: Boolean, default: true },
    adLabelPosition: { type: String as PropType<AdLabelPosition>, default: 'top-left' }
  },
  setup(props) {
    const adLoaded = ref(false);
    const adFailed = ref(false);

    return () => {
      if (adFailed.value) return null;
      const hiddenClass = adLoaded.value ? '' : 'pointer-events-none absolute h-0 w-0 scale-95 overflow-hidden opacity-0';
      return h('div', { class: hiddenClass }, [
        h(AdBanner, {
          format: props.format,
          provider: props.provider,
          className: props.className,
          adLabel: props.adLabel,
          showAdLabel: props.showAdLabel,
          adLabelPosition: props.adLabelPosition,
          onLoad: () => { adLoaded.value = true; },
          onError: () => { adFailed.value = true; }
        })
      ]);
    };
  }
});

export default AdBanner;