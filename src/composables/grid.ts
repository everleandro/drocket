import { getCurrentInstance, ref, computed } from "vue";
export function useGrid(preffix = "e-col") {
  const props = ref(getCurrentInstance()?.props);
  const gridClass = computed((): Array<string> => {
    const result = [];
    props?.value?.cols && result.push(`${preffix}-${props?.value?.cols}`);
    props?.value?.xs && result.push(`${preffix}-xs-${props?.value?.xs}`);
    props?.value?.sm && result.push(`${preffix}-sm-${props?.value?.sm}`);
    props?.value?.md && result.push(`${preffix}-md-${props?.value?.md}`);
    props?.value?.lg && result.push(`${preffix}-lg-${props?.value?.lg}`);
    props?.value?.xl && result.push(`${preffix}-xl-${props?.value?.xl}`);
    return result.length > 0 ? [...result, preffix] : [preffix];
  });

  return {
    gridClass,
  };
}
