import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import EDialog from './index.vue';

describe('EDialog', () => {
  it('has inheritAttrs set to false', () => {
    expect(EDialog.inheritAttrs).toBe(false);
  });

  it('applies custom class from attrs to dialog panel without extraneous attribute warnings', async () => {
    const wrapper = mount(EDialog, {
      props: {
        modelValue: true,
      },
      attrs: {
        class: 'custom-dialog-class',
      },
      slots: {
        default: 'Dialog Content',
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    const dialogPanel = document.body.querySelector('.e-dialog');
    expect(dialogPanel).not.toBeNull();
    expect(dialogPanel?.classList.contains('custom-dialog-class')).toBe(true);

    wrapper.unmount();
  });
});
