import { reactive, readonly } from "vue";

type DrawerLayout = {
  left: string;
  right: string;
};

type AppBarLayout = {
  enabled: boolean;
  height: number;
  clipped: boolean;
};

type LayoutConfig = {
  appBar?: Partial<AppBarLayout>;
  drawer?: Partial<DrawerLayout>;
};

const state = reactive({
  appBarHeight: 0,
  appBarClipped: false,
  leftDrawerWidth: "0px",
  rightDrawerWidth: "0px",
});

const mainLayoutStyle = reactive<Record<string, string>>({
  paddingTop: "0px",
  paddingLeft: "0px",
  paddingRight: "0px",
});

const drawerLayoutStyle = reactive<Record<string, string>>({
  paddingTop: "0px",
});

const barLayoutStyle = reactive<Record<string, string>>({
  left: "0px",
  right: "0px",
});

const applyLayout = (): void => {
  mainLayoutStyle.paddingTop = `${state.appBarHeight}px`;
  mainLayoutStyle.paddingLeft = state.leftDrawerWidth;
  mainLayoutStyle.paddingRight = state.rightDrawerWidth;

  drawerLayoutStyle.paddingTop = state.appBarClipped
    ? `${state.appBarHeight}px`
    : "0px";

  barLayoutStyle.left = state.leftDrawerWidth;
  barLayoutStyle.right = state.rightDrawerWidth;
};

const setLayoutConfig = ({ appBar, drawer }: LayoutConfig): void => {
  if (appBar) {
    if (appBar.enabled === false) {
      state.appBarHeight = 0;
      state.appBarClipped = false;
    } else {
      if (typeof appBar.height === "number") {
        state.appBarHeight = appBar.height;
      }
      if (typeof appBar.clipped === "boolean") {
        state.appBarClipped = appBar.clipped;
      }
    }
  }

  if (drawer) {
    if (typeof drawer.left === "string") {
      state.leftDrawerWidth = drawer.left;
    }
    if (typeof drawer.right === "string") {
      state.rightDrawerWidth = drawer.right;
    }
  }

  applyLayout();
};

const setAppBarLayout = ({ enabled, height, clipped }: AppBarLayout): void => {
  setLayoutConfig({
    appBar: {
      enabled,
      height,
      clipped,
    },
  });
};

const setDrawerLayout = ({ left, right }: DrawerLayout): void => {
  setLayoutConfig({
    drawer: {
      left,
      right,
    },
  });
};

export default function useLayout() {
  return {
    layout: readonly(state),
    mainLayoutStyle: readonly(mainLayoutStyle),
    drawerLayoutStyle: readonly(drawerLayoutStyle),
    barLayoutStyle: readonly(barLayoutStyle),
    setLayoutConfig,
    setAppBarLayout,
    setDrawerLayout,
    refreshLayout: applyLayout,
  };
}
