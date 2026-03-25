import { computed, inject, provide, reactive, readonly, type InjectionKey } from "vue";

type LayoutSide = "left" | "right";

type AppBarLayoutState = {
  enabled: boolean;
  height: number;
  clipped: boolean;
  app: boolean;
  absolute: boolean;
  fixed: boolean;
};

type DrawerLayoutState = {
  enabled: boolean;
  open: boolean;
  width: string;
  absolute: boolean;
  floating: boolean;
  fixed: boolean;
};

type LayoutState = {
  appBar: AppBarLayoutState;
  drawers: Record<LayoutSide, DrawerLayoutState>;
};

type SetAppBarLayoutPayload = Partial<AppBarLayoutState>;

type SetDrawerLayoutPayload = Partial<DrawerLayoutState> & {
  side: LayoutSide;
};

const createInitialAppBarState = (): AppBarLayoutState => ({
  enabled: false,
  height: 0,
  clipped: false,
  app: false,
  absolute: false,
  fixed: false,
});

const createInitialDrawerState = (): DrawerLayoutState => ({
  enabled: false,
  open: false,
  width: "0px",
  absolute: false,
  floating: false,
  fixed: false,
});

const createLayoutStore = () => {
  const state = reactive<LayoutState>({
    appBar: createInitialAppBarState(),
    drawers: {
      left: createInitialDrawerState(),
      right: createInitialDrawerState(),
    },
  });

  const mainTopOffset = computed((): string => {
    if (!state.appBar.enabled || !state.appBar.app) {
      return "0px";
    }

    return `${state.appBar.height}px`;
  });

  const getDrawerOffset = (side: LayoutSide): string => {
    const drawer = state.drawers[side];

    if (!drawer.enabled || !drawer.open || drawer.absolute) {
      return "0px";
    }

    return drawer.width;
  };

  const mainLayoutStyle = computed<Record<string, string>>(() => ({
    paddingTop: mainTopOffset.value,
    paddingLeft: getDrawerOffset("left"),
    paddingRight: getDrawerOffset("right"),
  }));

  const drawerLayoutStyle = computed<Record<string, string>>(() => ({
    paddingTop:
      state.appBar.enabled && state.appBar.app && state.appBar.clipped
        ? `${state.appBar.height}px`
        : "0px",
  }));

  const barLayoutStyle = computed<Record<string, string>>(() => ({
    left: state.appBar.app ? getDrawerOffset("left") : "0px",
    right: state.appBar.app ? getDrawerOffset("right") : "0px",
  }));

  const setAppBarLayout = (payload: SetAppBarLayoutPayload): void => {
    Object.assign(state.appBar, payload);

    if (payload.enabled === false) {
      Object.assign(state.appBar, createInitialAppBarState(), payload);
    }
  };

  const resetAppBarLayout = (): void => {
    Object.assign(state.appBar, createInitialAppBarState());
  };

  const setDrawerLayout = ({ side, ...payload }: SetDrawerLayoutPayload): void => {
    Object.assign(state.drawers[side], payload);

    if (payload.enabled === false) {
      Object.assign(state.drawers[side], createInitialDrawerState(), payload);
    }
  };

  const resetDrawerLayout = (side: LayoutSide): void => {
    Object.assign(state.drawers[side], createInitialDrawerState());
  };

  return {
    layout: readonly(state),
    mainLayoutStyle,
    drawerLayoutStyle,
    barLayoutStyle,
    setAppBarLayout,
    resetAppBarLayout,
    setDrawerLayout,
    resetDrawerLayout,
  };
};

type LayoutStore = ReturnType<typeof createLayoutStore>;

const layoutInjectionKey: InjectionKey<LayoutStore> = Symbol("e-layout");
const fallbackLayoutStore = createLayoutStore();

export const provideLayout = (): LayoutStore => {
  const store = createLayoutStore();
  provide(layoutInjectionKey, store);
  return store;
};

export default function useLayout(): LayoutStore {
  return inject(layoutInjectionKey, fallbackLayoutStore);
}
