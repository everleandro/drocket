 <template>
  <div>
  <section class="block">
      <h2>List</h2>

      <div class="list-demo-grid">
    <div class="list-demo-card">
          <h3>Single selection</h3>
          <p class="playground-note">
            Current value: {{ selectedListItem ?? "none" }}
          </p>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="x-small">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-avatar="avatarOne" 
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="small">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-avatar="avatarOne" 
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :append-avatar="avatarOne" 
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="large">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
           :prepend-avatar="avatarOne" 
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="x-large">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-avatar="avatarOne" 
            />
          </EList>
        </div>



        <div class="list-demo-card">
          <h3>Single selection</h3>
          <p class="playground-note">
            Current value: {{ selectedListItem ?? "none" }}
          </p>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="x-small">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-icon="item.icon"
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="small">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-icon="item.icon"
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-icon="item.icon"
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="large">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-icon="item.icon"
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="x-large">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-icon="item.icon"
            />
          </EList>
        </div>

        <div class="list-demo-card">
          <h3>Keyboard navigation</h3>
          <p class="playground-note">
            Usa Tab para entrar, ArrowUp y ArrowDown para mover el foco, Home y End para saltar,
            y Enter o Space para seleccionar. Valor actual: {{ keyboardNavigationValue ?? "none" }}
          </p>

          <EList v-model="keyboardNavigationValue" color="success" outlined>
            <EListItem
              v-for="item in keyboardNavigationItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-icon="item.icon"
            />
          </EList>
        </div>

        <div class="list-demo-card">
          <h3>Nested groups</h3>
          <p class="playground-note">
            Rutas abiertas: {{ nestedGroupModel.length ? nestedGroupModel.join(", ") : "none" }}
          </p>

          <EList v-model:group="nestedGroupModel" color="primary" outlined>
            <EListGroup value="components">
              <template #activator="{ attrs }">
                <EListItem v-bind="attrs" title="Components" subtitle="Nivel raiz" />
              </template>

              <EListItem title="Button" subtitle="Componente base" :prepend-icon="iconFactory.arrowRight" />

              <EListGroup value="navigation">
                <template #activator="{ attrs }">
                  <EListItem v-bind="attrs" title="Navigation" subtitle="Segundo nivel" />
                </template>

                <EListItem title="List" subtitle="Item hijo visible al expandir" :prepend-icon="iconFactory.arrowRight" />

                <EListGroup value="advanced">
                  <template #activator="{ attrs }">
                    <EListItem v-bind="attrs" title="Advanced" subtitle="Tercer nivel" />
                  </template>

                  <EListItem title="Nested keyboard" subtitle="Valida la ruta components/navigation/advanced" :prepend-icon="iconFactory.clear" />
                </EListGroup>
              </EListGroup>
            </EListGroup>

            <EListGroup value="guides">
              <template #activator="{ attrs }">
                <EListItem v-bind="attrs" title="Guides" subtitle="Otra rama del arbol" />
              </template>

              <EListItem title="Getting started" subtitle="Ruta guides" :prepend-icon="iconFactory.arrowLeft" />
            </EListGroup>
          </EList>
        </div>


        
        <div class="list-demo-card">
          <h3>Multiple selection + sizes</h3>
          <p class="playground-note">
            Selected: {{ multiSelectItemsValue.length ? multiSelectItemsValue.join(", ") : "none" }}
          </p>

          <EList v-model="multiSelectItemsValue" color="secondary" dense elevation="sm">
            <EListItem value="xs" title="xSmall item" subtitle="Compact utility action" size="x-small" :prepend-icon="iconFactory.clear" />
            <EListItem value="sm" title="Small item" subtitle="Secondary quick action" size="small" :prepend-icon="iconFactory.arrowLeft" />
            <EListItem value="lg" title="Large item" subtitle="Primary highlighted action" size="large" :prepend-avatar="avatarOne" />
            <EListItem value="xl" title="xLarge item" subtitle="Prominent rich option" size="x-large" :append-avatar="avatarTwo" />
          </EList>
        </div>

        <div class="list-demo-card">
          <h3>Content variants</h3>
          <EList color="warning" dense>
            <EListItem title="Status" subtitle="Prepend icon + append icon" :prepend-icon="iconFactory.arrowLeft"
              :append-icon="iconFactory.clear" />
            <EListItem title="Profile" subtitle="Avatar-driven item" :prepend-avatar="avatarOne" />
            <EListItem title="Media" subtitle="Append avatar example" :append-avatar="avatarTwo" />
          </EList>
        </div>

        <div class="list-demo-card">
          <h3>Append Layout Inspection</h3>
          <p class="playground-note">
            Casos minimos para inspeccionar el grid del item con append y con prepend + append.
          </p>

          <EList color="primary" outlined>
            <EListItem
              title="Append avatar only"
              subtitle="Debe renderizar content + gap + avatar"
              :append-avatar="avatarTwo"
            />
            <EListItem
              title="Prepend icon + append avatar"
              subtitle="Debe renderizar prepend + content + append sin columna implicita"
              :prepend-icon="iconFactory.arrowLeft"
              :append-avatar="avatarTwo"
            />
            <EListItem
              title="Prepend avatar + append icon"
              subtitle="Valida el caso inverso con ambos affixes"
              :prepend-avatar="avatarOne"
              :append-icon="iconFactory.clear"
            />
          </EList>
        </div>
      </div>
    </section>
    <section class="block">
      <h2>Grid</h2>

      <!-- Grid más complejo -->
      <ERow dense>
        <ECol :cols="12" :sm="6" :lg="3">
          <ECard class="e-pa-3" elevation="xs">1</ECard>
        </ECol>
        <ECol :cols="12" :sm="6" :lg="3">
          <ECard class="e-mt-3" elevation="sm">2</ECard>
        </ECol>
        <ECol :cols="12" :sm="6" :lg="3">
          <ECard elevation="md">3</ECard>
        </ECol>
        <ECol :cols="12" :sm="6" :lg="3">
          <ECard elevation="lg">4</ECard>
        </ECol>
      </ERow>

      <!-- Sin gutters -->
      <ERow noGutters>
        <ECol :cols="6">
          <ECard>No gap</ECard>
        </ECol>
        <ECol :cols="6">
          <ECard>No gap</ECard>
        </ECol>
      </ERow>

      <!-- Equal height -->
      <ERow equal>
        <ECol :cols="4">
          <ECard>Tall</ECard>
        </ECol>
        <ECol :cols="4">
          <ECard>Normal</ECard>
        </ECol>
        <ECol :cols="4">
          <div class="box">Normal</div>
        </ECol>
      </ERow>
    </section>
    <section class="block">
      <h2>Expansion</h2>
      <div class="row  my-4">
        <EExpansionPanels accordion>
          <EExpansionPanel v-for="i in 3" :key="i" :header-title="'accordion: ' + i" color="primary">
            <div class="secondary--text">
              <code> content {{ i }} </code>
            </div>
          </EExpansionPanel>
        </EExpansionPanels>
      </div>
      <div>{{ expansionModel }}</div>
      <div class="row  my-4">
        <EExpansionPanels v-model="expansionModel" color="secondary">
          <EExpansionPanel v-for="i in 3" :key="i" :header-title="'accordion: ' + i" :color="i === 1 ? 'primary' : ''"
            :value="i">
            <div class="secondary--text">
              lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit auctor dui, at condimentum
              nisl. Integer ac nisi id erat facilisis efficitur. {{ i }}
            </div>
          </EExpansionPanel>
        </EExpansionPanels>
      </div>
      <div class="row  my-4">
        <EExpansionPanels v-model="expansionModel" color="secondary">
          <EExpansionPanel header-title="custom color" color="warning" :toggle-icon="iconFactory.clear">
            <div class="secondary--text">
              <code> content with custom icons </code>
            </div>
          </EExpansionPanel>
        </EExpansionPanels>
      </div>


    </section>

    

    <section class="block">
      <h2>Button</h2>
      <div class="row">
        <EButton color="primary" elevation="lg">Primary</EButton>
        <EButton color="secondary" outlined>Outlined</EButton>
        <EButton color="brand" rounded>Custom Brand</EButton>
        <EButton color="secondary" rounded>secondary</EButton>
        <EButton text rounded :prepend-icon="iconFactory.arrowLeft">Text Button</EButton>
        <EButton :prepend-icon="iconFactory.arrowLeft" color="warning">With Icon</EButton>
      </div>
    </section>

    <section class="block">
      <h2>Icon</h2>
      <div class="row">
        <EIcon :icon="iconFactory.arrowLeft" />
        <EIcon :icon="iconFactory.arrowRight" large color="primary" />
        <EIcon :icon="iconFactory.clear" x-large color="error" />
      </div>
    </section>

    <section class="block">
      <h2>Avatar</h2>

      <div class="chip-group">
        <h3>Preset sizes</h3>
        <div class="row">
          <EAvatar size="x-small" />
          <EAvatar size="small" color="primary" />
          <EAvatar size="default" color="secondary" />
          <EAvatar size="large" color="success" />
          <EAvatar size="x-large" color="warning" />
        </div>
      </div>

      <div class="chip-group">
        <h3>Content modes</h3>
        <div class="row">
          <EAvatar />
          <EAvatar :icon="iconFactory.clear" color="error" />
          <EAvatar src="https://i.pravatar.cc/64?img=15" />
          <EAvatar src="https://i.pravatar.cc/64?img=32" elevation="lg" />
          <EAvatar size="large" color="brand" />
        </div>
      </div>
    </section>

    <section class="block">
      <h2>Dialog</h2>
      <div class="row">
        <EButton color="primary" @click="dialogDefault = true">Open Default</EButton>
        <EButton color="secondary" @click="dialogFluid = true">Open Fluid</EButton>
        <EButton color="secondary" outlined @click="dialogPersistent = true">Open Persistent</EButton>
        <EButton color="brand" @click="dialogFullscreen = true">Open Fullscreen</EButton>
        <EButton color="success" @click="dialogParent = true">Open Nested</EButton>
      </div>

      <EDialog v-model="dialogDefault" :max-width="520" elevation="xl">
        <div class="dialog-card">
          <h3>Default Dialog</h3>
          <p>This is a standard dialog. Click outside or press ESC to close.</p>
          <div class="dialog-actions">
            <EButton text @click="dialogDefault = false">Cancel</EButton>
            <EButton color="primary" @click="dialogDefault = false">Confirm</EButton>
          </div>
        </div>
      </EDialog>

      <EDialog v-model="dialogFluid" fluid elevation="xl">
        <div class="dialog-card">
          <h3>Fluid Dialog</h3>
          <p>This dialog keeps full width, unlike the default fit-content behavior.</p>
          <div class="dialog-actions">
            <EButton text @click="dialogFluid = false">Close</EButton>
          </div>
        </div>
      </EDialog>

      <EDialog v-model="dialogPersistent" persistent :max-width="520" elevation="xl">
        <div class="dialog-card">
          <h3>Persistent Dialog</h3>
          <p>
            This dialog ignores outside click and ESC unless you use an action.
          </p>
          <div class="dialog-actions">
            <EButton text @click="dialogPersistent = false">Close</EButton>
            <EButton color="warning" @click="dialogPersistent = false">Understood</EButton>
          </div>
        </div>
      </EDialog>

      <EDialog v-model="dialogFullscreen" fullscreen>
        <div class="dialog-fullscreen-content">
          <h3>Fullscreen Dialog</h3>
          <p>Useful for long forms or mobile-friendly full-screen flows.</p>
          <EButton color="primary" @click="dialogFullscreen = false">Close Fullscreen</EButton>
        </div>
      </EDialog>

      <EDialog v-model="dialogParent" :max-width="600" elevation="xl">
        <div class="dialog-card">
          <h3>Parent Dialog</h3>
          <p>
            Open the child dialog and test: press ESC or click outside. Only the
            child should close first.
          </p>
          <div class="dialog-actions">
            <EButton text @click="dialogParent = false">Close Parent</EButton>
            <EButton color="primary" @click="dialogChild = true">Open Child Dialog</EButton>
          </div>
        </div>

        <EDialog v-model="dialogChild" :max-width="440" elevation="lg">
          <div class="dialog-card dialog-card--child">
            <h3>Child Dialog</h3>
            <p>
              This is the top dialog. ESC and outside click should close only
              this one.
            </p>
            <div class="dialog-actions">
              <EButton text @click="dialogChild = false">Cancel</EButton>
              <EButton color="primary" @click="dialogChild = false">Close Child</EButton>
            </div>
          </div>
        </EDialog>
      </EDialog>
    </section>

    <section class="block">
      <h2>Chip</h2>

      <div class="chip-group">
        <h3>Sizes</h3>
        <div class="row">
          <EChip size="x-small" selected>x-small</EChip>
          <EChip size="small">small</EChip>
          <EChip size="default">default</EChip>
          <EChip size="large">large</EChip>
          <EChip size="x-large">x-large</EChip>
        </div>
      </div>

      <div class="chip-group">
        <h3>Content</h3>
        <div class="row">
          <EChip color="primary" :prepend-icon="iconFactory.arrowLeft" selected>With prepend</EChip>
          <EChip color="secondary" :append-icon="iconFactory.clear">With append</EChip>
          <EChip color="warning" prepend-avatar="https://i.pravatar.cc/40?img=12">Avatar chip</EChip>
          <EChip text color="success">Text chip</EChip>
          <EChip color="tertiary" closable @click:close="chipMessage = 'Closable chip closed'">Closable</EChip>
        </div>
      </div>

      <div class="chip-group">
        <h3>Interactive</h3>
        <div class="row">
          <EChip v-for="option in filterChips" :key="option.value" clickable ripple
            :selected="selectedFilters.includes(option.value)" color="primary" @click="toggleFilter(option.value)">
            {{ option.label }}
          </EChip>
        </div>
      </div>

      <div class="chip-group">
        <h3>Closable + clickable</h3>
        <div class="row">
          <EChip v-for="tag in tags" :key="tag" clickable closable color="brand" @click="chipMessage = `Clicked ${tag}`"
            @click:close="removeTag(tag)">
            {{ tag }}
          </EChip>
        </div>
      </div>

      <p class="playground-note">{{ chipMessage }}</p>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import EAvatar from "../../src/components/avatar.vue";
import EButton from "../../src/components/button/index.vue";
import EChip from "../../src/components/chip/index.vue";
import EIcon from "../../src/components/icon/index.vue";
import EDialog from "../../src/components/dialog/index.vue";
import ECard from "../../src/components/card/index.vue";
import EList from "../../src/components/list/index.vue";
import EListGroup from "../../src/components/list/group.vue";
import EListItem from "../../src/components/list/item.vue";
import ERow from "../../src/components/grid/row.vue";
import ECol from "../../src/components/grid/col.vue";
import EExpansionPanel from "../../src/components/expansion/panel.vue";
import EExpansionPanels from "../../src/components/expansion/panels.vue";
import iconFactory from "../../src/utils/icons";

const theme = ref("light");
const expansionModel = ref([]);
const selectedListItem = ref("inbox");
const keyboardNavigationValue = ref("focus");
const nestedGroupModel = ref(["components", "components/navigation"]);
const multiSelectItemsValue = ref(["sm", "xl"]);
const dialogDefault = ref(false);
const dialogFluid = ref(false);
const dialogPersistent = ref(false);
const dialogFullscreen = ref(false);
const dialogParent = ref(false);
const dialogChild = ref(false);
const selectedFilters = ref(["vue", "scss"]);
const tags = ref(["Vue 3", "TypeScript", "SCSS", "Autocomplete"]);
const chipMessage = ref("Try the chip interactions below.");

const avatarOne = "https://i.pravatar.cc/64?img=12";
const avatarTwo = "https://i.pravatar.cc/64?img=32";

const singleSelectItems = [
  {
    value: "inbox",
    title: "Inbox",
    subtitle: "14 unread messages",
    icon: iconFactory.arrowRight,
  },
  {
    value: "drafts",
    title: "Drafts",
    subtitle: "3 items pending review",
    icon: iconFactory.arrowLeft,
  },
  {
    value: "archive",
    title: "Archive",
    subtitle: "Everything shipped this week",
    icon: iconFactory.clear,
  },
];

const keyboardNavigationItems = [
  {
    value: "focus",
    title: "Focus entry",
    subtitle: "Primer item para entrar al roving tabindex",
    icon: iconFactory.arrowRight,
  },
  {
    value: "browse",
    title: "Browse with arrows",
    subtitle: "Mueve el foco con ArrowUp y ArrowDown",
    icon: iconFactory.arrowLeft,
  },
  {
    value: "jump",
    title: "Home and End",
    subtitle: "Salta al inicio o al final sin salir de la lista",
    icon: iconFactory.clear,
  },
  {
    value: "select",
    title: "Confirm selection",
    subtitle: "Activa este item con Enter o Space",
    icon: iconFactory.arrowRight,
  },
];

const filterChips = [
  { label: "Vue", value: "vue" },
  { label: "TypeScript", value: "typescript" },
  { label: "SCSS", value: "scss" },
  { label: "A11y", value: "a11y" },
];

watch(dialogParent, (value) => {
  if (!value) {
    dialogChild.value = false;
  }
});

const toggleFilter = (value) => {
  selectedFilters.value = selectedFilters.value.includes(value)
    ? selectedFilters.value.filter((current) => current !== value)
    : [...selectedFilters.value, value];

  chipMessage.value = `Selected filters: ${selectedFilters.value.join(", ") || "none"}`;
};

const removeTag = (tag) => {
  tags.value = tags.value.filter((current) => current !== tag);
  chipMessage.value = `Removed ${tag}`;
};

const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme.value);
  localStorage.setItem("playground-theme", theme.value);
};

onMounted(() => {
  // Restore saved theme or use system preference
  const saved = localStorage.getItem("playground-theme");
  if (saved) {
    theme.value = saved;
  } else {
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    theme.value = systemDark ? "dark" : "light";
  }
  document.documentElement.setAttribute("data-theme", theme.value);
});
</script>

<style scoped>
.playground {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #f7f9fb, #eef4ff);
  transition: background 0.3s ease;
}

.playground[data-theme="dark"] {
  background: linear-gradient(135deg, #121212, #1e1e1e);
}

.playground-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.playground-header h1 {
  margin: 0;
  color: #333;
}

.playground[data-theme="dark"] .playground-header h1 {
  color: #fafafa;
}

.theme-toggle {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.playground[data-theme="dark"] .theme-toggle {
  background: #2a2a2a;
  border-color: #444;
  color: #fafafa;
}

.theme-toggle:hover {
  opacity: 0.8;
}

.block {
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition:
    background,
    box-shadow 0.3s ease;
}

.playground[data-theme="dark"] .block {
  background: #2a2a2a;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.block h2 {
  color: #333;
  margin-top: 0;
}

.block h3 {
  margin: 0 0 12px;
  color: #4a5568;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.playground[data-theme="dark"] .block h2 {
  color: #fafafa;
}

.playground[data-theme="dark"] .block h3 {
  color: #cbd5e0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.chip-group+.chip-group {
  margin-top: 20px;
}

.playground-note {
  margin: 20px 0 0;
  color: #4a5568;
  font-size: 14px;
}

.playground[data-theme="dark"] .playground-note {
  color: #e2e8f0;
}

.dialog-card {
  background: var(--e-color-surface-1, #fff);
  color: var(--e-contrast-surface-1, #222);
  border-radius: 14px;
  padding: 20px;
  min-width: 320px;
}

.dialog-card h3 {
  margin: 0 0 8px;
}

.dialog-card p {
  margin: 0 0 16px;
  line-height: 1.45;
}

.dialog-card--child {
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.list-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.list-demo-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.playground[data-theme="dark"] .list-demo-card {
  background: rgba(17, 24, 39, 0.55);
  border-color: rgba(148, 163, 184, 0.16);
}

.dialog-fullscreen-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: var(--e-color-surface-1, #fff);
  color: var(--e-contrast-surface-1, #222);
}

:global(:root) {
  --e-color-brand: #1e88e5;
  --e-contrast-brand: #ffffff;
}
</style>
